export type StatusServicoContratado = 'CONTRATADO' | 'EM_ANDAMENTO' | 'REALIZADO';

export interface ServicoContratado {
  id: number;
  servicoId: number;
  titulo: string;
  categoria: string;
  bairro: string;
  cidade: string;
  nomePrestador: string;
  statusAtual: StatusServicoContratado;
}
