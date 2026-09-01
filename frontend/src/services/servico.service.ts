import api from './api';
import type { ServicoDetalhe } from '../models/servico-detalhe.model';
import type { ServicoFiltro } from '../models/servico-filtro.model';
import type { ServicoResumo } from '../models/servico-resumo.model';
import type { StatusServico } from '../models/servico-status.enum';

export interface StatusUpdatePayload {
  status: StatusServico;
}

class ServicoService {
  async buscar(filtros: ServicoFiltro = {}): Promise<ServicoResumo[]> {
    const params: Record<string, string> = {};
    if (filtros.categoria) params.categoria = filtros.categoria;
    if (filtros.cidade) params.cidade = filtros.cidade;
    if (filtros.bairro) params.bairro = filtros.bairro;

    const response = await api.get<ServicoResumo[]>('/servicos', { params });
    return response.data;
  }

  async buscarPorId(id: string | number): Promise<ServicoDetalhe> {
    const response = await api.get<ServicoDetalhe>(`/servicos/${id}`);
    return response.data;
  }

  async atualizarStatus(id: string | number, status: StatusServico): Promise<void> {
    const payload: StatusUpdatePayload = { status };
    await api.put(`/servicos/${id}/status`, payload);
  }
}

export const servicoService = new ServicoService();
