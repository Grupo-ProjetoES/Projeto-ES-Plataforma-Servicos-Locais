import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { HistoricoServicoContratado } from '../../../../models/historico-servico-contratado.model';
import HistoricoServicoCard from '../HistoricoServicoCard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockHistoricoRealizado: HistoricoServicoContratado = {
  id: 1,
  tituloServico: 'Reparo de Encanação',
  nomePrestador: 'João Silva',
  dataContratacao: '2026-08-15T10:30:00',
  status: 'REALIZADO',
  avaliado: false,
};

const mockHistoricoEmAndamento: HistoricoServicoContratado = {
  id: 2,
  tituloServico: 'Pintura Residencial',
  nomePrestador: 'Maria Santos',
  dataContratacao: '2026-08-20T14:00:00',
  status: 'EM_ANDAMENTO',
  avaliado: false,
};

const mockHistoricoAvaliado: HistoricoServicoContratado = {
  id: 3,
  tituloServico: 'Limpeza Geral',
  nomePrestador: 'Carlos Oliveira',
  dataContratacao: '2026-08-10T09:00:00',
  status: 'REALIZADO',
  avaliado: true,
};

const renderWithRouter = (component: React.ReactNode) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

describe('HistoricoServicoCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('deve exibir informações do serviço corretamente', () => {
    renderWithRouter(
      <HistoricoServicoCard historico={mockHistoricoRealizado} />
    );

    expect(screen.getByText('Reparo de Encanação')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();
    expect(screen.getByText('15 de agosto de 2026')).toBeInTheDocument();
  });

  test('deve exibir botão de avaliar para serviços concluídos sem avaliação', () => {
    const mockAvaliar = vi.fn();
    renderWithRouter(
      <HistoricoServicoCard
        historico={mockHistoricoRealizado}
        onAvaliar={mockAvaliar}
      />
    );

    expect(
      screen.getByRole('button', { name: /avaliar prestador/i })
    ).toBeInTheDocument();
  });

  test('deve não exibir botão de avaliar para serviços em andamento', () => {
    const mockAvaliar = vi.fn();
    renderWithRouter(
      <HistoricoServicoCard
        historico={mockHistoricoEmAndamento}
        onAvaliar={mockAvaliar}
      />
    );

    expect(
      screen.queryByRole('button', { name: /avaliar prestador/i })
    ).not.toBeInTheDocument();
  });

  test('deve exibir indicador de já avaliado', () => {
    renderWithRouter(
      <HistoricoServicoCard historico={mockHistoricoAvaliado} />
    );

    expect(screen.getByText('✓ Já avaliado')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /avaliar prestador/i })
    ).not.toBeInTheDocument();
  });

  test('deve chamar onAvaliar ao clicar no botão de avaliação', async () => {
    const user = userEvent.setup();
    const mockAvaliar = vi.fn();

    renderWithRouter(
      <HistoricoServicoCard
        historico={mockHistoricoRealizado}
        onAvaliar={mockAvaliar}
      />
    );

    const botaoAvaliar = screen.getByRole('button', {
      name: /avaliar prestador/i,
    });
    await user.click(botaoAvaliar);

    expect(mockAvaliar).toHaveBeenCalledWith(1);
  });

  test('deve navegar para o serviço ao clicar em ver serviço', async () => {
    const user = userEvent.setup();
    renderWithRouter(
      <HistoricoServicoCard historico={mockHistoricoRealizado} />
    );

    const botaoDetalhes = screen.getByRole('button', { name: /ver serviço/i });
    await user.click(botaoDetalhes);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/1');
  });

  test('deve aplicar classe CSS correta para cada status', () => {
    const { container: containerRealizado } = renderWithRouter(
      <HistoricoServicoCard historico={mockHistoricoRealizado} />
    );
    expect(
      containerRealizado.querySelector('.status-realizado')
    ).toBeInTheDocument();

    const { container: containerAndamento } = renderWithRouter(
      <HistoricoServicoCard historico={mockHistoricoEmAndamento} />
    );
    expect(
      containerAndamento.querySelector('.status-em-andamento')
    ).toBeInTheDocument();
  });

  test('deve formatar data em português', () => {
    renderWithRouter(
      <HistoricoServicoCard historico={mockHistoricoRealizado} />
    );

    expect(screen.getByText('15 de agosto de 2026')).toBeInTheDocument();
  });
});
