export type StatusServicoPrestador = 'CONTRATADO' | 'EM_ANDAMENTO' | 'REALIZADO';

export interface ServicoContratadoPrestador {
  id: number;
  titulo: string;
  categoria: string;
  nomeContratante: string;
  localAtendimento: string;
  dataOuPeriodoSolicitado: string;
  statusAtual: StatusServicoPrestador;
}
