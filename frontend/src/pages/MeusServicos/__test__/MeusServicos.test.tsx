import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { ServicoCadastroResponse } from '../../../models/servico-cadastro.model';
import { cadastroServicoService } from '../../../services/cadastro-servico.service';
import MeusServicos from '../MeusServicos';

// Mock do serviço de cadastro e gestão de serviços do prestador
vi.mock('../../../services/cadastro-servico.service', () => ({
  cadastroServicoService: {
    listarMeusServicos: vi.fn(),
    deletar: vi.fn(),
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

const mockMeusServicos: ServicoCadastroResponse[] = [
  {
    id: 1,
    titulo: 'Instalação de Ar Condicionado',
    descricao: 'Instalação completa com teste de pressão e vácuo.',
    categoria: 'CLIMATIZACAO',
    cidade: 'Arcoverde',
    bairro: 'Centro',
  } as unknown as ServicoCadastroResponse,
  {
    id: 2,
    titulo: 'Reparo Elétrico',
    descricao: 'Manutenção de quadros elétricos e fiação.',
    categoria: 'ELETRICA',
    cidade: 'Arcoverde',
    bairro: 'São Cristóvão',
  } as unknown as ServicoCadastroResponse,
];

describe('Página MeusServicos (Gerenciamento do Prestador)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <MeusServicos />
      </BrowserRouter>
    );

  test('deve exibir estado de carregamento e depois listar os serviços cadastrados do prestador', async () => {
    vi.mocked(cadastroServicoService.listarMeusServicos).mockResolvedValueOnce(
      mockMeusServicos
    );

    renderComponent();

    expect(screen.getByText('Carregando serviços...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Instalação de Ar Condicionado')).toBeInTheDocument();
      expect(screen.getByText('Reparo Elétrico')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem de estado vazio e permitir navegar para cadastro', async () => {
    const user = userEvent.setup();
    vi.mocked(cadastroServicoService.listarMeusServicos).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Você ainda não possui serviços cadastrados.')
      ).toBeInTheDocument();
    });

    const btnCadastrarPrimeiro = screen.getByRole('button', {
      name: /cadastrar meu primeiro serviço/i,
    });
    await user.click(btnCadastrarPrimeiro);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/cadastrar');
  });

  test('deve exibir mensagem de erro caso o carregamento da API falhar', async () => {
    vi.mocked(cadastroServicoService.listarMeusServicos).mockRejectedValueOnce(
      new Error('Erro de rede')
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar a lista de serviços.')
      ).toBeInTheDocument();
    });
  });

  test('deve excluir o serviço ao confirmar no diálogo do navegador', async () => {
    const user = userEvent.setup();
    vi.mocked(cadastroServicoService.listarMeusServicos).mockResolvedValueOnce(
      mockMeusServicos
    );
    vi.mocked(cadastroServicoService.deletar).mockResolvedValueOnce({} as never);

    // Simula confirmação positiva do window.confirm
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Instalação de Ar Condicionado')).toBeInTheDocument();
    });

    const btnsExcluir = screen.getAllByRole('button', { name: /excluir/i });
    await user.click(btnsExcluir[0]);

    await waitFor(() => {
      expect(cadastroServicoService.deletar).toHaveBeenCalledWith(1);
      expect(
        screen.queryByText('Instalação de Ar Condicionado')
      ).not.toBeInTheDocument();
    });
  });

  test('não deve excluir o serviço se o usuário cancelar a confirmação', async () => {
    const user = userEvent.setup();
    vi.mocked(cadastroServicoService.listarMeusServicos).mockResolvedValueOnce(
      mockMeusServicos
    );

    // Simula cancelamento do window.confirm
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Instalação de Ar Condicionado')).toBeInTheDocument();
    });

    const btnsExcluir = screen.getAllByRole('button', { name: /excluir/i });
    await user.click(btnsExcluir[0]);

    expect(cadastroServicoService.deletar).not.toHaveBeenCalled();
    expect(screen.getByText('Instalação de Ar Condicionado')).toBeInTheDocument();
  });

  test('deve navegar corretamente ao clicar nos botões de Orçamentos e Serviços Contratados', async () => {
    const user = userEvent.setup();
    vi.mocked(cadastroServicoService.listarMeusServicos).mockResolvedValueOnce(
      mockMeusServicos
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Instalação de Ar Condicionado')).toBeInTheDocument();
    });

    const btnsOrcamentos = screen.getAllByRole('button', { name: /ver orçamentos/i });
    await user.click(btnsOrcamentos[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/meus-servicos/orcamentos/1');

    const btnsContratados = screen.getAllByRole('button', {
      name: /serviços contratados/i,
    });
    await user.click(btnsContratados[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/meus-servicos/contratados');
  });

  test('deve navegar para a tela de cadastro ao clicar no botão "+ Novo Serviço"', async () => {
    const user = userEvent.setup();
    vi.mocked(cadastroServicoService.listarMeusServicos).mockResolvedValueOnce(
      mockMeusServicos
    );

    renderComponent();

    const btnNovoServico = screen.getByRole('button', { name: /\+ novo serviço/i });
    await user.click(btnNovoServico);

    expect(mockNavigate).toHaveBeenCalledWith('/servicos/cadastrar');
  });
});
