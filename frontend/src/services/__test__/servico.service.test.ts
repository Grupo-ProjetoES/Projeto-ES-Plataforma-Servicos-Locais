import { beforeEach, describe, expect, test, vi } from 'vitest';
import api from '../api';
import { servicoService } from '../servico.service';
import type { ServicoComparacao } from '../../models/servico-comparacao.model';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('servicoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('deve buscar serviços com filtros preenchidos', async () => {
    const mockResponse = [{ id: 1, titulo: 'Pintura' }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

    const resultado = await servicoService.buscar({
      categoria: 'PINTURA',
      cidade: 'Arcoverde',
      bairro: 'Centro',
    });

    expect(api.get).toHaveBeenCalledWith('/servicos', {
      params: {
        categoria: 'PINTURA',
        cidade: 'Arcoverde',
        bairro: 'Centro',
      },
    });
    expect(resultado).toEqual(mockResponse);
  });

  test('deve buscar serviços com filtros vazios por padrão', async () => {
    const mockResponse = [{ id: 1, titulo: 'Pintura' }];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

    const resultado = await servicoService.buscar();

    expect(api.get).toHaveBeenCalledWith('/servicos', {
      params: {},
    });
    expect(resultado).toEqual(mockResponse);
  });

  test('deve buscar serviço por ID', async () => {
    const mockResponse = { id: 1, titulo: 'Pintura' };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

    const resultado = await servicoService.buscarPorId(1);

    expect(api.get).toHaveBeenCalledWith('/servicos/1');
    expect(resultado).toEqual(mockResponse);
  });

  test('deve comparar serviços enviando IDs como query string separada por vírgula', async () => {
    const mockResponse: ServicoComparacao[] = [
      {
        id: 1,
        titulo: 'Pintura',
        categoria: 'PINTURA',
        cidade: 'Arcoverde',
        bairro: 'Centro',
        formaCobranca: 'POR_HORA',
        nomePrestador: 'Carlos',
        notaMediaPrestador: 4.5,
        totalAvaliacoesPrestador: 2,
      },
      {
        id: 2,
        titulo: 'Elétrica',
        categoria: 'ELETRICA',
        cidade: 'Arcoverde',
        bairro: 'Centro',
        formaCobranca: 'DIARIA',
        nomePrestador: 'Ana',
        notaMediaPrestador: null,
        totalAvaliacoesPrestador: 0,
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

    const resultado = await servicoService.comparar([1, 2]);

    expect(api.get).toHaveBeenCalledWith('/servicos/comparar', {
      params: { ids: '1,2' },
    });
    expect(resultado).toEqual(mockResponse);
  });

  test('deve atualizar o status do serviço', async () => {
    vi.mocked(api.put).mockResolvedValueOnce({ data: {} });

    await servicoService.atualizarStatus(1, 'CONTRATADO');

    expect(api.put).toHaveBeenCalledWith('/servicos/1/status', {
      status: 'CONTRATADO',
    });
  });
});
