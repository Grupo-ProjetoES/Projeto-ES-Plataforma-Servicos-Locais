import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { ServicoFiltro } from '../../../models/servico-filtro.model';
import type { ServicoResumo } from '../../../models/servico-resumo.model';
import { servicoService } from '../../../services/servico.service';
import Servicos from '../Servicos';

// Mock do serviço de serviços
vi.mock('../../../services/servico.service', () => ({
  servicoService: {
    buscar: vi.fn(),
  },
}));

// Mock do componente ServiceFilters para simplificar a interacao de filtros
vi.mock('../../../components/ServiceFilters/ServiceFilters', () => ({
  default: ({
    onSearch,
    loading,
  }: {
    onSearch: (filtros: ServicoFiltro) => void;
    loading: boolean;
  }) => (
    <div data-testid="service-filters">
      <button
        type="button"
        disabled={loading}
        onClick={() => onSearch({ categoria: 'PINTURA', cidade: 'Arcoverde' })}
      >
        Filtrar Pintura
      </button>
    </div>
  ),
}));

const mockServicos: ServicoResumo[] = [
  {
    id: 1,
    titulo: 'Pintura de Parede Residencial',
    categoria: 'PINTURA',
    cidade: 'Arcoverde',
    bairro: 'Centro',
    nomePrestador: 'Carlos Silva',
  },
  {
    id: 2,
    titulo: 'Pintura de Fachada Externa',
    categoria: 'PINTURA',
    cidade: 'Arcoverde',
    bairro: 'São Cristóvão',
    nomePrestador: 'Bruno Pinturas',
  },
  {
    id: 3,
    titulo: 'Pintura Fina e Acabamento',
    categoria: 'PINTURA',
    cidade: 'Arcoverde',
    bairro: 'Centro',
    nomePrestador: 'Leandro Tintas',
  },
  {
    id: 4,
    titulo: 'Pintura Simples e Econômica',
    categoria: 'PINTURA',
    cidade: 'Arcoverde',
    bairro: 'Boa Vista',
    nomePrestador: 'Rafael Pintor',
  },
  {
    id: 5,
    titulo: 'Instalação Elétrica',
    categoria: 'ELETRICA',
    cidade: 'Arcoverde',
    bairro: 'São Cristóvão',
    nomePrestador: 'Ana Souza',
  },
];

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Página de Serviços (Servicos)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (initialEntries = ['/servicos']) =>
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/servicos" element={<Servicos />} />
        </Routes>
      </MemoryRouter>
    );

  test('deve exibir o estado de carregamento e depois listar os serviços retornados', async () => {
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    expect(screen.getByText('Carregando serviços...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
      expect(screen.getByText('Instalação Elétrica')).toBeInTheDocument();
      expect(screen.getByText('Prestador: Carlos Silva')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de estado vazio quando a busca retornar array vazio', async () => {
    vi.mocked(servicoService.buscar).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Nenhum resultado encontrado.')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de erro quando a chamada da API falhar', async () => {
    vi.mocked(servicoService.buscar).mockRejectedValueOnce(new Error('Erro de conexão'));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar os serviços. Tente novamente mais tarde.')
      ).toBeInTheDocument();
    });
  });

  test('deve passar os parametros da URL como filtro inicial para a API', async () => {
    vi.mocked(servicoService.buscar).mockResolvedValueOnce([mockServicos[0]]);

    // Renderiza com query params na URL
    renderComponent(['/servicos?categoria=PINTURA&cidade=Arcoverde']);

    await waitFor(() => {
      expect(servicoService.buscar).toHaveBeenCalledWith({
        categoria: 'PINTURA',
        cidade: 'Arcoverde',
        bairro: undefined,
      });
    });
  });

  test('deve navegar para a página de detalhes do serviço ao clicar no card', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const cardPintura = screen.getByRole('button', {
      name: /pintura de parede residencial/i,
    });
    await user.click(cardPintura);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/1');
  });

  test('deve atualizar os parametros de busca ao acionar a função handleSearch', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValue(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(servicoService.buscar).toHaveBeenCalledTimes(1);
    });

    const btnFiltrar = screen.getByRole('button', { name: /filtrar pintura/i });
    await user.click(btnFiltrar);

    await waitFor(() => {
      expect(servicoService.buscar).toHaveBeenCalledWith({
        categoria: 'PINTURA',
        cidade: 'Arcoverde',
        bairro: undefined,
      });
    });
  });

  test('deve permitir selecionar serviços para comparação e atualizar o contador visual', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkbox1 = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    const checkbox2 = screen.getByLabelText(/comparar serviço pintura de fachada externa/i);

    expect(screen.queryByTestId('comparacao-contador')).not.toBeInTheDocument();

    await user.click(checkbox1);

    expect(screen.getByTestId('comparacao-contador')).toHaveTextContent('1/3 selecionados');
    expect(checkbox1).toBeChecked();

    await user.click(checkbox2);

    expect(screen.getByTestId('comparacao-contador')).toHaveTextContent('2/3 selecionados');
    expect(checkbox2).toBeChecked();
  });

  test('deve manter o botão Comparar desabilitado com 1 serviço e habilitar com 2 ou 3 serviços', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkbox1 = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    const checkbox2 = screen.getByLabelText(/comparar serviço pintura de fachada externa/i);
    const checkbox3 = screen.getByLabelText(/comparar serviço pintura fina e acabamento/i);

    await user.click(checkbox1);
    const btnComparar = screen.getByRole('button', { name: /comparar serviços/i });
    expect(btnComparar).toBeDisabled();

    await user.click(checkbox2);
    expect(btnComparar).toBeEnabled();

    await user.click(checkbox3);
    expect(btnComparar).toBeEnabled();
  });

  test('deve bloquear a seleção ao tentar marcar um 4º serviço e exibir aviso', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkbox1 = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    const checkbox2 = screen.getByLabelText(/comparar serviço pintura de fachada externa/i);
    const checkbox3 = screen.getByLabelText(/comparar serviço pintura fina e acabamento/i);
    const checkbox4 = screen.getByLabelText(/comparar serviço pintura simples e econômica/i);

    await user.click(checkbox1);
    await user.click(checkbox2);
    await user.click(checkbox3);

    expect(screen.getByTestId('comparacao-contador')).toHaveTextContent('3/3 selecionados');
    expect(
      screen.queryByText('Você pode selecionar no máximo 3 serviços para comparação.')
    ).not.toBeInTheDocument();

    await user.click(checkbox4);

    expect(checkbox4).not.toBeChecked();
    const avisos = screen.getAllByText('Você pode selecionar no máximo 3 serviços para comparação.');
    expect(avisos.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('comparacao-contador')).toHaveTextContent('3/3 selecionados');
  });

  test('deve bloquear a seleção de serviço de categoria diferente e exibir aviso', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkboxPintura = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    const checkboxEletrica = screen.getByLabelText(/comparar serviço instalação elétrica/i);

    await user.click(checkboxPintura);
    expect(checkboxPintura).toBeChecked();
    expect(screen.getByTestId('comparacao-contador')).toHaveTextContent('1/3 selecionados');

    await user.click(checkboxEletrica);

    expect(checkboxEletrica).not.toBeChecked();
    expect(screen.getByTestId('comparacao-contador')).toHaveTextContent('1/3 selecionados');
    const avisos = screen.getAllByText('Só é possível comparar serviços da mesma categoria (PINTURA).');
    expect(avisos.length).toBeGreaterThanOrEqual(1);
  });

  test('deve navegar para /servicos/comparar ao clicar em Comparar serviços', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkbox1 = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    const checkbox2 = screen.getByLabelText(/comparar serviço pintura de fachada externa/i);

    await user.click(checkbox1);
    await user.click(checkbox2);

    const btnComparar = screen.getByRole('button', { name: /comparar serviços/i });
    await user.click(btnComparar);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/comparar?ids=1,2');
  });

  test('deve limpar toda a seleção ao clicar no botão Limpar seleção', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkbox1 = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    const checkbox2 = screen.getByLabelText(/comparar serviço pintura de fachada externa/i);

    await user.click(checkbox1);
    await user.click(checkbox2);

    const btnLimpar = screen.getByRole('button', { name: /limpar seleção/i });
    await user.click(btnLimpar);

    expect(screen.queryByTestId('comparacao-contador')).not.toBeInTheDocument();
    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).not.toBeChecked();
  });

  test('deve permitir desmarcar um serviço individualmente', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkbox1 = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    const checkbox2 = screen.getByLabelText(/comparar serviço pintura de fachada externa/i);

    await user.click(checkbox1);
    await user.click(checkbox2);
    expect(screen.getByTestId('comparacao-contador')).toHaveTextContent('2/3 selecionados');

    await user.click(checkbox1);
    expect(screen.getByTestId('comparacao-contador')).toHaveTextContent('1/3 selecionados');
    expect(checkbox1).not.toBeChecked();
    expect(checkbox2).toBeChecked();
  });

  test('não deve navegar para detalhes ao clicar apenas no checkbox de comparação', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkbox1 = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    await user.click(checkbox1);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('deve navegar para detalhes do serviço ao pressionar Enter ou Espaço no card', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const cardPintura = screen.getByRole('button', {
      name: /pintura de parede residencial/i,
    });

    cardPintura.focus();
    await user.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith('/servicos/1');

    mockNavigate.mockClear();
    await user.keyboard(' ');
    expect(mockNavigate).toHaveBeenCalledWith('/servicos/1');

    mockNavigate.mockClear();
    await user.keyboard('{ArrowDown}');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('deve aplicar aria-disabled e title explicativo no checkbox de serviço com categoria diferente', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.buscar).mockResolvedValueOnce(mockServicos);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Pintura de Parede Residencial')).toBeInTheDocument();
    });

    const checkboxPintura = screen.getByLabelText(/comparar serviço pintura de parede residencial/i);
    const checkboxEletrica = screen.getByLabelText(/comparar serviço instalação elétrica/i);

    expect(checkboxEletrica).toHaveAttribute('aria-disabled', 'false');

    await user.click(checkboxPintura);

    expect(checkboxEletrica).toHaveAttribute('aria-disabled', 'true');
    expect(checkboxEletrica.closest('label')).toHaveAttribute(
      'title',
      'Só é possível comparar serviços da mesma categoria (PINTURA).'
    );
  });
});