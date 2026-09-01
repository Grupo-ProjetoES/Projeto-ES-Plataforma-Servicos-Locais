import api from './api';
import type { ServicoContratado } from '../models/servico-contratado.model';
import type { ServicoContratadoPrestador } from '../models/servico-contratado-prestador.model';
import type { HistoricoServicoContratado } from '../models/historico-servico-contratado.model';

class ServicoContratadoService {
  async listar(): Promise<ServicoContratado[]> {
    const response = await api.get<ServicoContratado[]>('/servicos/contratados');
    return response.data;
  }

  async listarDoPrestador(): Promise<ServicoContratadoPrestador[]> {
    const response = await api.get<ServicoContratadoPrestador[]>(
      '/servicos/contratados/prestador'
    );
    return response.data;
  }

  async listarHistorico(): Promise<HistoricoServicoContratado[]> {
    const response = await api.get<HistoricoServicoContratado[]>(
      '/servicos/contratados/historico'
    );
    return response.data;
  }
}

export const servicoContratadoService = new ServicoContratadoService();
