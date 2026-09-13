import type { FormaCobranca } from './servico-detalhe.model';

export interface ServicoComparacao {
  id: number;
  titulo: string;
  categoria: string;
  bairro: string;
  cidade: string;
  formaCobranca: FormaCobranca;
  nomePrestador: string;
  notaMediaPrestador: number | null;
  totalAvaliacoesPrestador: number;
}
