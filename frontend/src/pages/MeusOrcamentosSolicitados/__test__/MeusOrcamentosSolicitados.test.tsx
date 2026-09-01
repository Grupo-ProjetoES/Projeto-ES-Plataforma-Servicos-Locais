import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { OrcamentoResponse } from '../../../models/orcamento-response.model';
import { orcamentoService } from '../../../services/orcamento.service';
import MeusOrcamentosSolicitados from '../MeusOrcamentosSolicitados';

// Mock do serviço de orçamentos
vi.mock('../../../services/orcamento.service', () => ({
  orcamentoService: {
    listarOrcamentosSolicitados: vi.fn(),
    aceitarOrcamento: vi.fn(),
    recusarOrcamento: vi.fn(),
  },
}));

// Mock do card de orçamento solicitado
vi.mock('../components/OrcamentoSolicitadoCard', () => ({
  default: ({
    orcamento,
    processandoId,
    servicoContratado,
    onDecidir,
  }: {
    orcamento: OrcamentoResponse;
    processandoId: number | null;
    servicoContratado: boolean;
    onDecidir: (id: number, acao: 'aceitar' | 'recusar') => void;
  }) => {
    const item = orcamento as unknown as Record<string, unknown>;
    const status =
      orcamento.statusResposta ||
      (item.statusResposta as string) ||
      'PENDENTE';

    const descricao =
      (item.descricaoNecessidade as string) ||
      orcamento.descricaoNecessidade ||
      '';

    return (
      <div data-testid="orcamento-solicitado-card">
        <h3>{descricao}</h3>
        <span>Status: {status}</span>
        <span>Contratado: {String(servicoContratado)}</span>
        <button
          type="button"
          disabled={processandoId === orcamento.id}
          onClick={() => onDecidir(orcamento.id, 'aceitar')}
        >
          Aceitar
        </button>
        <button
          type="button"
          disabled={processandoId === orcamento.id}
          onClick={() => onDecidir(orcamento.id, 'recusar')}
        >
          Recusar
        </button>
      </div>
    );
  },
}));

const mockOrcamentosSolicitados: OrcamentoResponse[] = [
  {
    id: 1,
    servicoId: 10,
    clienteId: 5,
    descricaoNecessidade: 'Instalação de torneira de cozinha',
    descricao_necessidade: 'Instalação de torneira de cozinha',
    statusResposta: 'RESPONDIDO',
  } as unknown as OrcamentoResponse,
];

describe('Página MeusOrcamentosSolicitados (Cliente)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <MeusOrcamentosSolicitados />
      </BrowserRouter>
    );

  test('deve exibir o estado de carregamento e listar as solicitações do cliente', async () => {
    vi.mocked(orcamentoService.listarOrcamentosSolicitados).mockResolvedValueOnce(
      mockOrcamentosSolicitados
    );

    renderComponent();

    expect(screen.getByText('Carregando solicitações...')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText('Instalação de torneira de cozinha')
      ).toBeInTheDocument();
      expect(screen.getByTestId('orcamento-solicitado-card')).toBeInTheDocument();
    });
  });

  test('deve exibir estado vazio quando o cliente não tiver orçamentos solicitados', async () => {
    vi.mocked(orcamentoService.listarOrcamentosSolicitados).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Você ainda não solicitou nenhum orçamento.')
      ).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de erro se a busca das solicitações falhar', async () => {
    vi.mocked(orcamentoService.listarOrcamentosSolicitados).mockRejectedValueOnce(
      new Error('Erro de conexão')
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar suas solicitações de orçamento.')
      ).toBeInTheDocument();
    });
  });

  test('deve aceitar a proposta de orçamento com sucesso após confirmação', async () => {
    const user = userEvent.setup();
    vi.mocked(orcamentoService.listarOrcamentosSolicitados).mockResolvedValueOnce(
      mockOrcamentosSolicitados
    );
    vi.mocked(orcamentoService.aceitarOrcamento).mockResolvedValueOnce({} as never);

    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Status: RESPONDIDO')).toBeInTheDocument();
    });

    const btnAceitar = screen.getByRole('button', { name: /aceitar/i });
    await user.click(btnAceitar);

    await waitFor(() => {
      expect(orcamentoService.aceitarOrcamento).toHaveBeenCalledWith(1);
      expect(screen.getByText('Status: ACEITO')).toBeInTheDocument();
      expect(screen.getByText('Contratado: true')).toBeInTheDocument();
    });
  });

  test('deve recusar a proposta de orçamento com sucesso após confirmação', async () => {
    const user = userEvent.setup();
    vi.mocked(orcamentoService.listarOrcamentosSolicitados).mockResolvedValueOnce(
      mockOrcamentosSolicitados
    );
    vi.mocked(orcamentoService.recusarOrcamento).mockResolvedValueOnce({} as never);

    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Status: RESPONDIDO')).toBeInTheDocument();
    });

    const btnRecusar = screen.getByRole('button', { name: /recusar/i });
    await user.click(btnRecusar);

    await waitFor(() => {
      expect(orcamentoService.recusarOrcamento).toHaveBeenCalledWith(1);
      expect(screen.getByText('Status: RECUSADO')).toBeInTheDocument();
    });
  });

  test('não deve chamar a API se o usuário cancelar o diálogo de confirmação', async () => {
    const user = userEvent.setup();
    vi.mocked(orcamentoService.listarOrcamentosSolicitados).mockResolvedValueOnce(
      mockOrcamentosSolicitados
    );

    vi.spyOn(window, 'confirm').mockReturnValueOnce(false);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Status: RESPONDIDO')).toBeInTheDocument();
    });

    const btnAceitar = screen.getByRole('button', { name: /aceitar/i });
    await user.click(btnAceitar);

    expect(orcamentoService.aceitarOrcamento).not.toHaveBeenCalled();
    expect(screen.getByText('Status: RESPONDIDO')).toBeInTheDocument();
  });

  test('deve exibir mensagem de erro da API quando a ação de aceitar/recusar falhar', async () => {
    const user = userEvent.setup();
    vi.mocked(orcamentoService.listarOrcamentosSolicitados).mockResolvedValueOnce(
      mockOrcamentosSolicitados
    );

    const mockAxiosError = {
      isAxiosError: true,
      response: { data: { message: 'Este orçamento expirou.' } },
    };
    vi.mocked(orcamentoService.aceitarOrcamento).mockRejectedValueOnce(mockAxiosError);

    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Status: RESPONDIDO')).toBeInTheDocument();
    });

    const btnAceitar = screen.getByRole('button', { name: /aceitar/i });
    await user.click(btnAceitar);

    await waitFor(() => {
      expect(screen.getByText('Este orçamento expirou.')).toBeInTheDocument();
    });
  });
});