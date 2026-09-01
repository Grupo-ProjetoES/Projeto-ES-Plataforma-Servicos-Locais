import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { OrcamentoResponse } from '../../../models/orcamento-response.model';
import { orcamentoService } from '../../../services/orcamento.service';
import OrcamentosRecebidos from '../OrcamentosRecebidos';

// Mock do serviço de orçamentos
vi.mock('../../../services/orcamento.service', () => ({
  orcamentoService: {
    listarOrcamentosRecebidos: vi.fn(),
  },
}));

// Mock do card de orçamento recebido (sem uso de 'any')
vi.mock('../components/OrcamentoRecebidoCard', () => ({
  default: ({
    orcamento,
    onResponder,
  }: {
    orcamento: OrcamentoResponse;
    onResponder: (orcamento: OrcamentoResponse) => void;
  }) => {
    const item = orcamento as unknown as Record<string, unknown>;
    const descricao =
      (item.descricaoNecessidade as string) ||
      orcamento.descricaoNecessidade ||
      '';
    const status =
      (item.statusResposta as string) ||
      orcamento.statusResposta ||
      'PENDENTE';

    return (
      <div data-testid="orcamento-card">
        <h3>{descricao}</h3>
        <span>Status: {status}</span>
        <button type="button" onClick={() => onResponder(orcamento)}>
          Responder Orçamento
        </button>
      </div>
    );
  },
}));

// Mock do modal de resposta
vi.mock('../components/ModalResponderOrcamento', () => ({
  default: ({
    orcamento,
    onClose,
    onSucesso,
  }: {
    orcamento: OrcamentoResponse;
    onClose: () => void;
    onSucesso: (orcamentoId: number, valor?: number, condicoes?: string) => void;
  }) => (
    <div data-testid="modal-responder">
      <h2>Modal Responder - {orcamento.id}</h2>
      <button
        type="button"
        onClick={() => onSucesso(orcamento.id, 250, 'Atendimento em até 2 dias')}
      >
        Confirmar Resposta
      </button>
      <button type="button" onClick={onClose}>
        Fechar Modal
      </button>
    </div>
  ),
}));

const mockOrcamentos: OrcamentoResponse[] = [
  {
    id: 1,
    servicoId: 10,
    clienteId: 5,
    descricaoNecessidade: 'Conserto de vazamento no banheiro',
    descricao_necessidade: 'Conserto de vazamento no banheiro',
    localAtendimento: 'Rua Principal, 123',
    local_atendimento: 'Rua Principal, 123',
    dataOuPeriodoDesejado: 'Urgente',
    data_ou_periodo_desejado: 'Urgente',
  } as unknown as OrcamentoResponse,
];

describe('Página OrcamentosRecebidos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <OrcamentosRecebidos />
      </BrowserRouter>
    );

  test('deve exibir o estado de carregamento e depois listar as solicitações recebidas', async () => {
    vi.mocked(orcamentoService.listarOrcamentosRecebidos).mockResolvedValueOnce(mockOrcamentos);

    renderComponent();

    expect(screen.getByText('Carregando solicitações...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Conserto de vazamento no banheiro')).toBeInTheDocument();
      expect(screen.getByTestId('orcamento-card')).toBeInTheDocument();
    });
  });

  test('deve exibir o estado vazio quando não houver orçamentos recebidos', async () => {
    vi.mocked(orcamentoService.listarOrcamentosRecebidos).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Nenhuma solicitação de orçamento recebida até o momento.')
      ).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de erro se a requisição à API falhar', async () => {
    vi.mocked(orcamentoService.listarOrcamentosRecebidos).mockRejectedValueOnce(
      new Error('Erro de conexão')
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar as solicitações de orçamento.')
      ).toBeInTheDocument();
    });
  });

  test('deve abrir o modal de resposta ao clicar no botão responder e permitir fechar', async () => {
    const user = userEvent.setup();
    vi.mocked(orcamentoService.listarOrcamentosRecebidos).mockResolvedValueOnce(mockOrcamentos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Conserto de vazamento no banheiro')).toBeInTheDocument();
    });

    const btnResponder = screen.getByRole('button', { name: /responder orçamento/i });
    await user.click(btnResponder);

    expect(screen.getByTestId('modal-responder')).toBeInTheDocument();
    expect(screen.getByText('Modal Responder - 1')).toBeInTheDocument();

    const btnFechar = screen.getByRole('button', { name: /fechar modal/i });
    await user.click(btnFechar);

    expect(screen.queryByTestId('modal-responder')).not.toBeInTheDocument();
  });

  test('deve atualizar o estado do orçamento na lista após responder com sucesso pelo modal', async () => {
    const user = userEvent.setup();
    vi.mocked(orcamentoService.listarOrcamentosRecebidos).mockResolvedValueOnce(mockOrcamentos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Status: PENDENTE')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /responder orçamento/i }));
    await user.click(screen.getByRole('button', { name: /confirmar resposta/i }));

    await waitFor(() => {
      expect(screen.getByText('Status: RESPONDIDO')).toBeInTheDocument();
    });
  });
});