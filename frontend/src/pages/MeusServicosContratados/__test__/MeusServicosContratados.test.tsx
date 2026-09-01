import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { ServicoContratadoPrestador } from '../../../models/servico-contratado-prestador.model';
import { servicoContratadoService } from '../../../services/servico-contratado.service';
import MeusServicosContratados from '../MeusServicosContratados';

vi.mock('../../../services/servico-contratado.service', () => ({
  servicoContratadoService: {
    listarDoPrestador: vi.fn(),
  },
}));

vi.mock('../components/ServicoContratadoPrestadorCard', () => ({
  default: ({
    servico,
    onAtualizarStatus,
  }: {
    servico: ServicoContratadoPrestador;
    onAtualizarStatus: (id: number) => void;
  }) => (
    <div data-testid="servico-contratado-prestador-card">
      <h2>{servico.titulo}</h2>
      <span>Contratante: {servico.nomeContratante}</span>
      <span>Data: {servico.dataOuPeriodoSolicitado}</span>
      <button type="button" onClick={() => onAtualizarStatus(servico.id)}>
        Atualizar status
      </button>
    </div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockServicosPrestador: ServicoContratadoPrestador[] = [
  {
    id: 1,
    titulo: 'Manutenção Preventiva de Ar Condicionado',
    categoria: 'CLIMATIZACAO',
    nomeContratante: 'Maria Clara',
    localAtendimento: 'Centro, Arcoverde',
    dataOuPeriodoSolicitado: '2026-09-10 pela manhã',
    statusAtual: 'CONTRATADO',
  },
];

describe('Página MeusServicosContratados (Prestador)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <MeusServicosContratados />
      </BrowserRouter>
    );

  test('deve exibir o estado de carregamento e listar os serviços sob responsabilidade do prestador', async () => {
    vi.mocked(servicoContratadoService.listarDoPrestador).mockResolvedValueOnce(
      mockServicosPrestador
    );

    renderComponent();

    expect(
      screen.getByText('Carregando serviços sob sua responsabilidade...')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText('Manutenção Preventiva de Ar Condicionado')
      ).toBeInTheDocument();
      expect(screen.getByText('Contratante: Maria Clara')).toBeInTheDocument();
      expect(screen.getByText('Data: 2026-09-10 pela manhã')).toBeInTheDocument();
      expect(screen.getByTestId('servico-contratado-prestador-card')).toBeInTheDocument();
    });
  });

  test('deve exibir o estado vazio quando o prestador não possuir serviços não iniciados', async () => {
    vi.mocked(servicoContratadoService.listarDoPrestador).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes('Você não possui serviços contratados não iniciados'))
      ).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de erro retornada pela API ao falhar o carregamento', async () => {
    vi.mocked(servicoContratadoService.listarDoPrestador).mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Sessão expirada. Faça login novamente.' } },
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Sessão expirada. Faça login novamente.')
      ).toBeInTheDocument();
    });
  });

  test('deve utilizar a mensagem de erro padrão quando a falha não vier da API', async () => {
    vi.mocked(servicoContratadoService.listarDoPrestador).mockRejectedValueOnce(
      new Error('Erro genérico')
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Não foi possível carregar os serviços sob sua responsabilidade. Tente novamente.'
        )
      ).toBeInTheDocument();
    });
  });

  test('deve navegar para o fluxo de atualização de status ao selecionar um serviço', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoContratadoService.listarDoPrestador).mockResolvedValueOnce(
      mockServicosPrestador
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Manutenção Preventiva de Ar Condicionado')
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /atualizar status/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/meus-servicos/contratados/1', {
      state: mockServicosPrestador[0],
    });
  });
});
