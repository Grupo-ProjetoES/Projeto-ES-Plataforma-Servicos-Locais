export interface OrcamentoResponse {
  id: number;
  descricaoNecessidade: string;
  localAtendimento: string;
  dataOuPeriodoDesejado: string;
  servicoId: number;
  tituloServico: string;
  nomePrestador: string;
  nomeSolicitante: string;
  emailSolicitante: string;
  //Campos opcionais
  descricaoResposta?: string;
  statusResposta?: string;
  valorResposta?: number;
}
