import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { ServicoContratado } from '../../../models/servico-contratado.model';
import { servicoContratadoService } from '../../../services/servico-contratado.service';
import ServicosContratadosCliente from '../ServicosContratadosCliente';

// Mock do serviço de serviços contratados
vi.mock('../../../services/servico-contratado.service', () => ({
  servicoContratadoService: {
    listar: vi.fn(),
  },
}));

// Mock do componente ServicoContratadoCard para isolar o teste do componente pai
vi.mock('../components/ServicoContratadoCard', () => ({
  default: ({
    servico,
    onVerDetalhes,
  }: {
    servico: ServicoContratado;
    onVerDetalhes: (id: number) => void;
  }) => (
    <div data-testid="servico-contratado-card">
      <h3>{servico.titulo}</h3>
      <button type="button" onClick={() => onVerDetalhes(servico.servicoId)}>
        Ver Detalhes
      </button>
    </div>
  ),
}));

// Mock do hook useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockServicosContratados: ServicoContratado[] = [
  {
    id: 1,
    servicoId: 101,
    titulo: 'Reforma de Banheiro',
    nomePrestador: 'Mário Encanador',
    status: 'EM_ANDAMENTO',
    dataContratacao: '2026-08-20',
  } as unknown as ServicoContratado,
];

describe('Página ServicosContratadosCliente', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ServicosContratadosCliente />
      </BrowserRouter>
    );

  test('deve exibir o estado de carregamento e depois listar os serviços contratados', async () => {
    vi.mocked(servicoContratadoService.listar).mockResolvedValueOnce(mockServicosContratados);

    renderComponent();

    expect(screen.getByText('Carregando serviços contratados...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Reforma de Banheiro')).toBeInTheDocument();
      expect(screen.getByTestId('servico-contratado-card')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de estado vazio e permitir navegar para busca de serviços', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoContratadoService.listar).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Você ainda não possui serviços contratados.')
      ).toBeInTheDocument();
    });

    const btnBuscar = screen.getByRole('button', { name: /buscar serviços/i });
    await user.click(btnBuscar);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos');
  });

  test('deve exibir o estado de erro com mensagem da API e permitir a ação de tentar novamente', async () => {
    const user = userEvent.setup();
    const mockAxiosError = {
      isAxiosError: true,
      response: { data: { message: 'Sessão expirada. Faça login novamente.' } },
    };

    // Primeira chamada falha, segunda passa
    vi.mocked(servicoContratadoService.listar)
      .mockRejectedValueOnce(mockAxiosError)
      .mockResolvedValueOnce(mockServicosContratados);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Sessão expirada. Faça login novamente.')).toBeInTheDocument();
    });

    const btnTentarNovamente = screen.getByRole('button', { name: /tentar novamente/i });
    await user.click(btnTentarNovamente);

    await waitFor(() => {
      expect(servicoContratadoService.listar).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Reforma de Banheiro')).toBeInTheDocument();
    });
  });

  test('deve utilizar a mensagem de erro padrão quando o erro não for do Axios', async () => {
    vi.mocked(servicoContratadoService.listar).mockRejectedValueOnce(new Error('Erro genérico'));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Não foi possível carregar seus serviços contratados. Tente novamente.'
        )
      ).toBeInTheDocument();
    });
  });

  test('deve navegar para a tela de detalhes ao clicar no botão do card', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoContratadoService.listar).mockResolvedValueOnce(mockServicosContratados);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Reforma de Banheiro')).toBeInTheDocument();
    });

    const btnDetalhes = screen.getByRole('button', { name: /ver detalhes/i });
    await user.click(btnDetalhes);
    expect(mockNavigate).toHaveBeenCalledWith('/servicos/101');
  });
});