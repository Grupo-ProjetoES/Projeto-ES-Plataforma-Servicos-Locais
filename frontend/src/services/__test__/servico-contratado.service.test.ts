import { beforeEach, describe, expect, test, vi } from 'vitest';
import api from '../api';
import { servicoContratadoService } from '../servico-contratado.service';
import type { ServicoContratadoPrestador } from '../../models/servico-contratado-prestador.model';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('servicoContratadoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('deve buscar os serviços contratados não iniciados do prestador autenticado', async () => {
    const mockResponse: ServicoContratadoPrestador[] = [
      {
        id: 1,
        titulo: 'Instalação de chuveiro',
        categoria: 'ELETRICA',
        nomeContratante: 'João da Silva',
        localAtendimento: 'Boa Vista, Recife',
        dataOuPeriodoSolicitado: '2026-09-15 à tarde',
        statusAtual: 'CONTRATADO',
      },
    ];

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

    const resultado = await servicoContratadoService.listarDoPrestador();

    expect(api.get).toHaveBeenCalledWith('/servicos/contratados/prestador');
    expect(resultado).toEqual(mockResponse);
  });
});
