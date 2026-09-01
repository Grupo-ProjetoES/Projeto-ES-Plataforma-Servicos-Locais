import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { servicoService } from '../../../services/servico.service';
import AtualizarStatusServico from '../AtualizarStatusServico';

vi.mock('../../../services/servico.service', () => ({
  servicoService: {
    buscarPorId: vi.fn(),
    atualizarStatus: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockServico = {
  id: 12,
  titulo: 'Instalação de ventilador de teto',
  descricao: 'Instalação com revisão da fiação existente.',
  categoria: 'ELETRICA',
  cidade: 'Recife',
  bairro: 'Boa Vista',
  formaCobranca: 'VALOR_FIXO_TOTAL',
  nomePrestador: 'Carlos Eletricista',
  telefonePrestador: '81999999999',
  descricaoPrestador: 'Especialista em instalações residenciais.',
};

const estadoAtendimento = {
  id: 12,
  titulo: 'Instalação de ventilador de teto',
  categoria: 'ELETRICA',
  nomeContratante: 'Fernanda Lima',
  localAtendimento: 'Boa Vista, Recife',
  dataOuPeriodoSolicitado: '2026-09-15 à tarde',
  statusAtual: 'CONTRATADO' as const,
};

describe('Página AtualizarStatusServico', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (
    path = '/meus-servicos/contratados/12',
    state: unknown = estadoAtendimento
  ) =>
    render(
      <MemoryRouter initialEntries={[{ pathname: path, state }]}>
        <Routes>
          <Route path="/meus-servicos/contratados/:id" element={<AtualizarStatusServico />} />
        </Routes>
      </MemoryRouter>
    );

  test('deve carregar os dados do serviço e exibir a próxima transição disponível', async () => {
    vi.mocked(servicoService.buscarPorId).mockResolvedValueOnce(mockServico);

    renderComponent();

    expect(screen.getByRole('status')).toHaveTextContent('Carregando dados do serviço...');

    await waitFor(() => {
      expect(screen.getByText('Instalação de ventilador de teto')).toBeInTheDocument();
      expect(screen.getByText('Fernanda Lima')).toBeInTheDocument();
      expect(screen.getByText('2026-09-15 à tarde')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /alterar para em andamento/i })
      ).toBeInTheDocument();
    });
  });

  test('deve atualizar o status do serviço com sucesso', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscarPorId).mockResolvedValueOnce(mockServico);
    vi.mocked(servicoService.atualizarStatus).mockResolvedValueOnce();

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /alterar para em andamento/i })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /alterar para em andamento/i }));

    await waitFor(() => {
      expect(servicoService.atualizarStatus).toHaveBeenCalledWith(12, 'EM_ANDAMENTO');
      expect(screen.getByText('Status atualizado para Em Andamento.')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /alterar para realizado/i })
      ).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem da API quando a atualização falhar', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscarPorId).mockResolvedValueOnce(mockServico);
    vi.mocked(servicoService.atualizarStatus).mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Mudança de status não permitida.' } },
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /alterar para em andamento/i })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /alterar para em andamento/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Mudança de status não permitida.');
    });
  });

  test('deve exibir mensagem de serviço inválido quando o id da rota for inválido', async () => {
    renderComponent('/meus-servicos/contratados/abc', undefined);

    expect(screen.getByRole('alert')).toHaveTextContent('Serviço inválido.');
    expect(servicoService.buscarPorId).not.toHaveBeenCalled();
  });

  test('deve voltar para a listagem ao clicar no botão de retorno', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscarPorId).mockResolvedValueOnce(mockServico);

    renderComponent();

    await user.click(
      screen.getByRole('button', {
        name: /voltar para serviços sob minha responsabilidade/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/meus-servicos/contratados');
  });
});
