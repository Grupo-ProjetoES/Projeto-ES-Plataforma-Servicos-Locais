import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { ServicoDetalhe as ServicoDetalheModel } from '../../../models/servico-detalhe.model';
import { servicoService } from '../../../services/servico.service';
import ServicoDetalhe from '../ServicoDetalhe';

// Mock do serviço de busca de detalhes
vi.mock('../../../services/servico.service', () => ({
  servicoService: {
    buscarPorId: vi.fn(),
  },
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

const mockServico: ServicoDetalheModel = {
  id: 1,
  titulo: 'Pintura Residencial Interna',
  descricao: 'Pintura de paredes e tetos com tinta acrílica premium.',
  categoria: 'PINTURA',
  cidade: 'Arcoverde',
  bairro: 'Centro',
  formaCobranca: 'VALOR_FIXO_TOTAL',
  nomePrestador: 'João Mestre Pintor',
  telefonePrestador: '87999999999',
  descricaoPrestador: 'Mais de 10 anos de experiência em acabamentos.',
} as ServicoDetalheModel;

describe('Página ServicoDetalhe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (path = '/servicos/1') =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/servicos/:id" element={<ServicoDetalhe />} />
        </Routes>
      </MemoryRouter>
    );

  test('deve exibir estado de carregamento e depois apresentar os detalhes do serviço', async () => {
    vi.mocked(servicoService.buscarPorId).mockResolvedValueOnce(mockServico);

    renderComponent();

    expect(screen.getByText('Carregando detalhes...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Pintura Residencial Interna' })).toBeInTheDocument();
      expect(screen.getByText('PINTURA')).toBeInTheDocument();
      expect(screen.getByText('Valor fixo')).toBeInTheDocument();
      expect(screen.getByText('João Mestre Pintor')).toBeInTheDocument();
      expect(screen.getByText('Telefone: 87999999999')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de erro caso o serviço não seja encontrado', async () => {
    vi.mocked(servicoService.buscarPorId).mockRejectedValueOnce(new Error('404 Not Found'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Serviço não encontrado.')).toBeInTheDocument();
    });
  });

  test('deve voltar para a lista de busca de serviços ao clicar no botão de voltar', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscarPorId).mockResolvedValueOnce(mockServico);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura Residencial Interna')).toBeInTheDocument();
    });

    const btnVoltar = screen.getByRole('button', { name: /← voltar para a busca/i });
    await user.click(btnVoltar);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos');
  });

  test('deve navegar para a tela de solicitação de orçamento ao clicar no botão correspondente', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscarPorId).mockResolvedValueOnce(mockServico);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura Residencial Interna')).toBeInTheDocument();
    });

    const btnSolicitar = screen.getByRole('button', { name: /solicitar orçamento/i });
    await user.click(btnSolicitar);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/1/solicitar-orcamento');
  });
});