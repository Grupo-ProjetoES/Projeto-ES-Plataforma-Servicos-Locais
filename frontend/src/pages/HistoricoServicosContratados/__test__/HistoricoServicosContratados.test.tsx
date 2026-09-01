import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { HistoricoServicoContratado } from '../../../models/historico-servico-contratado.model';
import { servicoContratadoService } from '../../../services/servico-contratado.service';
import HistoricoServicosContratados from '../HistoricoServicosContratados';

vi.mock('../../../services/servico-contratado.service', () => ({
  servicoContratadoService: {
    listarHistorico: vi.fn(),
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

const mockHistorico: HistoricoServicoContratado[] = [
  {
    id: 1,
    tituloServico: 'Reparo de Cano',
    nomePrestador: 'João Silva',
    dataContratacao: '2026-08-15T10:30:00',
    status: 'REALIZADO',
    avaliado: true,
  },
  {
    id: 2,
    tituloServico: 'Limpeza Residencial',
    nomePrestador: 'Maria Santos',
    dataContratacao: '2026-08-20T14:00:00',
    status: 'REALIZADO',
    avaliado: false,
  },
  {
    id: 3,
    tituloServico: 'Pintura de Parede',
    nomePrestador: 'Carlos Oliveira',
    dataContratacao: '2026-08-25T09:00:00',
    status: 'EM_ANDAMENTO',
    avaliado: false,
  },
];

describe('Página HistoricoServicosContratados (Cliente)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <HistoricoServicosContratados />
      </BrowserRouter>
    );

  test('deve exibir estado de carregamento e listar o histórico de serviços', async () => {
    vi.mocked(servicoContratadoService.listarHistorico).mockResolvedValueOnce(
      mockHistorico
    );

    renderComponent();

    expect(screen.getByText('Carregando histórico...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Reparo de Cano')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Limpeza Residencial')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });
  });

  test('deve exibir estado vazio quando não houver histórico', async () => {
    vi.mocked(servicoContratadoService.listarHistorico).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Você ainda não contratou nenhum serviço.')
      ).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de erro ao falhar no carregamento', async () => {
    vi.mocked(servicoContratadoService.listarHistorico).mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'Erro ao conectar com o servidor' } },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Erro ao conectar com o servidor')).toBeInTheDocument();
    });
  });

  test('deve exibir indicador de avaliação já realizada para serviços concluídos', async () => {
    vi.mocked(servicoContratadoService.listarHistorico).mockResolvedValueOnce(
      mockHistorico
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('✓ Já avaliado')).toBeInTheDocument();
    });
  });

  test('deve exibir botão de avaliação para serviços concluídos sem avaliação', async () => {
    vi.mocked(servicoContratadoService.listarHistorico).mockResolvedValueOnce(
      mockHistorico
    );

    renderComponent();

    await waitFor(() => {
      const botoeAvaliar = screen.getAllByRole('button', { name: /avaliar prestador/i });
      expect(botoeAvaliar.length).toBe(1); // Apenas um serviço sem avaliação
    });
  });

  test('deve navegar para a página de avaliação ao clicar no botão avaliar', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoContratadoService.listarHistorico).mockResolvedValueOnce(
      mockHistorico
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Limpeza Residencial')).toBeInTheDocument();
    });

    const botaoAvaliar = screen.getByRole('button', { name: /avaliar prestador/i });
    await user.click(botaoAvaliar);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/2/avaliar-prestador');
  });

  test('deve navegar para o serviço ao clicar no botão ver serviço', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoContratadoService.listarHistorico).mockResolvedValueOnce(
      mockHistorico
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Reparo de Cano')).toBeInTheDocument();
    });

    const botoes = screen.getAllByRole('button', { name: /ver serviço/i });
    await user.click(botoes[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/1');
  });

  test('deve exibir status formatados corretamente', async () => {
    vi.mocked(servicoContratadoService.listarHistorico).mockResolvedValueOnce(
      mockHistorico
    );

    renderComponent();

    await waitFor(() => {
        const concluidos = screen.getAllByText('Concluído');
        expect(concluidos.length).toBe(2);
        expect(screen.getByText('Em andamento')).toBeInTheDocument();
    });
  });

  test('deve exibir datas formatadas em português', async () => {
    vi.mocked(servicoContratadoService.listarHistorico).mockResolvedValueOnce(
      mockHistorico
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('15 de agosto de 2026')).toBeInTheDocument();
    });
  });
});
