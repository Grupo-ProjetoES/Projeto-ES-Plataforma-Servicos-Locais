import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { ServicoComparacao } from '../../../models/servico-comparacao.model';
import { servicoService } from '../../../services/servico.service';
import CompararServicos from '../CompararServicos';

vi.mock('../../../services/servico.service', () => ({
  servicoService: {
    comparar: vi.fn(),
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

const mockServicosComparacao: ServicoComparacao[] = [
  {
    id: 1,
    titulo: 'Pintura Residencial',
    categoria: 'PINTURA',
    cidade: 'Arcoverde',
    bairro: 'Centro',
    formaCobranca: 'POR_HORA',
    nomePrestador: 'Carlos Silva',
    notaMediaPrestador: 4.8,
    totalAvaliacoesPrestador: 5,
  },
  {
    id: 2,
    titulo: 'Instalação Elétrica',
    categoria: 'ELETRICA',
    cidade: 'Arcoverde',
    bairro: 'São Cristóvão',
    formaCobranca: 'VALOR_FIXO_TOTAL',
    nomePrestador: 'Ana Souza',
    notaMediaPrestador: 5.0,
    totalAvaliacoesPrestador: 1,
  },
  {
    id: 3,
    titulo: 'Limpeza de Fachada',
    categoria: 'LIMPEZA',
    cidade: 'Arcoverde',
    bairro: 'Boa Vista',
    formaCobranca: 'DIARIA',
    nomePrestador: 'Maria Santos',
    notaMediaPrestador: null,
    totalAvaliacoesPrestador: 0,
  },
];

describe('Página de Comparação de Serviços (CompararServicos)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (initialPath = '/servicos/comparar?ids=1,2') =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/servicos/comparar" element={<CompararServicos />} />
        </Routes>
      </MemoryRouter>
    );

  test('deve exibir o estado de carregamento enquanto a requisição estiver pendente', async () => {
    vi.mocked(servicoService.comparar).mockReturnValue(new Promise(() => {}));

    renderComponent('/servicos/comparar?ids=1,2');

    expect(screen.getByText('Carregando comparação...')).toBeInTheDocument();
  });

  test('deve exibir mensagem de estado inválido quando houver menos de 2 IDs na URL', async () => {
    renderComponent('/servicos/comparar?ids=1');

    expect(
      screen.getByText('Selecione entre 2 e 3 serviços na busca para realizar a comparação.')
    ).toBeInTheDocument();
    expect(servicoService.comparar).not.toHaveBeenCalled();

    const btnIrBusca = screen.getByRole('button', { name: /ir para a busca de serviços/i });
    await userEvent.click(btnIrBusca);
    expect(mockNavigate).toHaveBeenCalledWith('/servicos');
  });

  test('deve exibir mensagem de estado inválido quando não houver parâmetro ids ou forem inválidos', async () => {
    renderComponent('/servicos/comparar');

    expect(
      screen.getByText('Selecione entre 2 e 3 serviços na busca para realizar a comparação.')
    ).toBeInTheDocument();
    expect(servicoService.comparar).not.toHaveBeenCalled();
  });

  test('deve exibir mensagem de estado inválido quando houver mais de 3 IDs na URL', async () => {
    renderComponent('/servicos/comparar?ids=1,2,3,4');

    expect(
      screen.getByText('Selecione entre 2 e 3 serviços na busca para realizar a comparação.')
    ).toBeInTheDocument();
    expect(servicoService.comparar).not.toHaveBeenCalled();
  });

  test('deve exibir mensagem de erro quando a chamada da API falhar', async () => {
    vi.mocked(servicoService.comparar).mockRejectedValueOnce(new Error('Falha no servidor'));

    renderComponent('/servicos/comparar?ids=1,2');

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar a comparação de serviços.')
      ).toBeInTheDocument();
    });
  });

  test('deve renderizar os dados dos serviços lado a lado com sucesso', async () => {
    vi.mocked(servicoService.comparar).mockResolvedValueOnce(mockServicosComparacao);

    renderComponent('/servicos/comparar?ids=1,2,3');

    await waitFor(() => {
      expect(screen.getByText('Pintura Residencial')).toBeInTheDocument();
      expect(screen.getByText('Instalação Elétrica')).toBeInTheDocument();
      expect(screen.getByText('Limpeza de Fachada')).toBeInTheDocument();
    });

    expect(servicoService.comparar).toHaveBeenCalledWith([1, 2, 3]);

    // Localização
    expect(screen.getByText('Centro, Arcoverde')).toBeInTheDocument();
    expect(screen.getByText('São Cristóvão, Arcoverde')).toBeInTheDocument();
    expect(screen.getByText('Boa Vista, Arcoverde')).toBeInTheDocument();

    // Formas de cobrança
    expect(screen.getByText('Por hora')).toBeInTheDocument();
    expect(screen.getByText('Valor fixo')).toBeInTheDocument();
    expect(screen.getByText('Diária')).toBeInTheDocument();

    // Prestadores
    expect(screen.getByText('Carlos Silva')).toBeInTheDocument();
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();

    // Avaliações
    expect(screen.getByText('★ 4.8 (5 avaliações)')).toBeInTheDocument();
    expect(screen.getByText('★ 5.0 (1 avaliação)')).toBeInTheDocument();
    expect(screen.getByText('Sem avaliações ainda')).toBeInTheDocument();
  });

  test('deve exibir o código original da forma de cobrança caso não esteja no mapeamento', async () => {
    const servicoCustom: ServicoComparacao[] = [
      {
        ...mockServicosComparacao[0],
        formaCobranca: 'OUTRA_FORMA' as unknown as ServicoComparacao['formaCobranca'],
      },
      mockServicosComparacao[1],
    ];

    vi.mocked(servicoService.comparar).mockResolvedValueOnce(servicoCustom);

    renderComponent('/servicos/comparar?ids=1,2');

    await waitFor(() => {
      expect(screen.getByText('OUTRA_FORMA')).toBeInTheDocument();
    });
  });

  test('deve remover um serviço da comparação e manter os demais quando houver 3 serviços', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.comparar).mockResolvedValueOnce(mockServicosComparacao);

    renderComponent('/servicos/comparar?ids=1,2,3');

    await waitFor(() => {
      expect(screen.getByText('Pintura Residencial')).toBeInTheDocument();
    });

    const btnRemoverPintura = screen.getByRole('button', {
      name: /remover pintura residencial da comparação/i,
    });
    await user.click(btnRemoverPintura);

    expect(screen.queryByText('Pintura Residencial')).not.toBeInTheDocument();
    expect(screen.getByText('Instalação Elétrica')).toBeInTheDocument();
    expect(screen.getByText('Limpeza de Fachada')).toBeInTheDocument();
  });

  test('deve exibir estado de serviços insuficientes ao remover e restar menos de 2 serviços', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.comparar).mockResolvedValueOnce([
      mockServicosComparacao[0],
      mockServicosComparacao[1],
    ]);

    renderComponent('/servicos/comparar?ids=1,2');

    await waitFor(() => {
      expect(screen.getByText('Pintura Residencial')).toBeInTheDocument();
    });

    const btnRemoverPintura = screen.getByRole('button', {
      name: /remover pintura residencial da comparação/i,
    });
    await user.click(btnRemoverPintura);

    expect(screen.getByTestId('comparar-insuficiente')).toBeInTheDocument();
    expect(screen.getByText('Restam menos de 2 serviços na comparação.')).toBeInTheDocument();

    const btnVoltarBusca = screen.getByRole('button', {
      name: /voltar para a busca e selecionar novos serviços/i,
    });
    await user.click(btnVoltarBusca);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos');
  });

  test('deve navegar para a página de detalhes ao clicar em Ver Detalhes', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.comparar).mockResolvedValueOnce([
      mockServicosComparacao[0],
      mockServicosComparacao[1],
    ]);

    renderComponent('/servicos/comparar?ids=1,2');

    await waitFor(() => {
      expect(screen.getByText('Pintura Residencial')).toBeInTheDocument();
    });

    const botoesDetalhes = screen.getAllByRole('button', { name: /ver detalhes/i });
    await user.click(botoesDetalhes[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/1');
  });

  test('deve navegar para a página de solicitação de orçamento ao clicar em Solicitar Orçamento', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.comparar).mockResolvedValueOnce([
      mockServicosComparacao[0],
      mockServicosComparacao[1],
    ]);

    renderComponent('/servicos/comparar?ids=1,2');

    await waitFor(() => {
      expect(screen.getByText('Pintura Residencial')).toBeInTheDocument();
    });

    const botoesOrcamento = screen.getAllByRole('button', { name: /solicitar orçamento/i });
    await user.click(botoesOrcamento[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/1/solicitar-orcamento');
  });

  test('deve navegar de volta para a busca ao clicar no botão Voltar para a busca no topo', async () => {
    const user = userEvent.setup();
    vi.mocked(servicoService.comparar).mockResolvedValueOnce([
      mockServicosComparacao[0],
      mockServicosComparacao[1],
    ]);

    renderComponent('/servicos/comparar?ids=1,2');

    await waitFor(() => {
      expect(screen.getByText('Pintura Residencial')).toBeInTheDocument();
    });

    const btnVoltar = screen.getByRole('button', { name: /voltar para a busca/i });
    await user.click(btnVoltar);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos');
  });

  test('não deve atualizar estado se o componente for desmontado durante a requisição', async () => {
    let resolvePromise: (data: ServicoComparacao[]) => void = () => {};
    const promise = new Promise<ServicoComparacao[]>((resolve) => {
      resolvePromise = resolve;
    });
    vi.mocked(servicoService.comparar).mockReturnValueOnce(promise);

    const { unmount } = renderComponent('/servicos/comparar?ids=1,2');
    unmount();

    resolvePromise([mockServicosComparacao[0], mockServicosComparacao[1]]);
    // Ensure no unhandled rejection or state leak
  });

  test('não deve atualizar estado se o componente for desmontado após erro na requisição', async () => {
    let rejectPromise: (err: Error) => void = () => {};
    const promise = new Promise<ServicoComparacao[]>((_, reject) => {
      rejectPromise = reject;
    });
    vi.mocked(servicoService.comparar).mockReturnValueOnce(promise);

    const { unmount } = renderComponent('/servicos/comparar?ids=1,2');
    unmount();

    rejectPromise(new Error('Erro'));
  });
});
