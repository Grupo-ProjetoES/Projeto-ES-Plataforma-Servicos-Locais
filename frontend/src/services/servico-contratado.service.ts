import api from './api';
import type { ServicoContratado } from '../models/servico-contratado.model';
import type { ServicoContratadoPrestador } from '../models/servico-contratado-prestador.model';

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
}

export const servicoContratadoService = new ServicoContratadoService();
