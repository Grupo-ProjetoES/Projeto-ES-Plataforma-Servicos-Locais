export type StatusServico = 'DISPONIVEL' | 'CONTRATADO' | 'EM_ANDAMENTO' | 'REALIZADO';

export const STATUS_SERVICO_LABELS: Record<StatusServico, string> = {
  DISPONIVEL: 'Disponível',
  CONTRATADO: 'Contratado',
  EM_ANDAMENTO: 'Em Andamento',
  REALIZADO: 'Realizado',
};

export const TRANSOES_PERMITIDAS: Record<StatusServico, StatusServico[]> = {
  DISPONIVEL: [],
  CONTRATADO: ['EM_ANDAMENTO'],
  EM_ANDAMENTO: ['REALIZADO'],
  REALIZADO: [],
};
