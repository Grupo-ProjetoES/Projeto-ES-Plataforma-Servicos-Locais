export type StatusServico = 'DISPONIVEL' | 'CONTRATADO' | 'EM_ANDAMENTO' | 'REALIZADO';

export interface HistoricoServicoContratado {
  id: number;
  tituloServico: string;
  nomePrestador: string;
  dataContratacao: string; // ISO 8601 datetime string
  status: StatusServico;
  avaliado: boolean;
}
