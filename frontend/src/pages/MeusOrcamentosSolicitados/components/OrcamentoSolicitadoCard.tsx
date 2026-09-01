import type { OrcamentoResponse } from '../../../models/orcamento-response.model';

interface OrcamentoSolicitadoCardProps {
  readonly orcamento: OrcamentoResponse;
  readonly processandoId: number | null;
  readonly servicoContratado: boolean;
  readonly onDecidir: (id: number, acao: 'aceitar' | 'recusar') => void;
}

function extrairStatus(orcamento: OrcamentoResponse): string {
  if (orcamento.statusResposta) {
    return orcamento.statusResposta;
  }
  const temResposta =
    orcamento.valorResposta != null || Boolean(orcamento.descricaoResposta);
  return temResposta ? 'RESPONDIDO' : 'PENDENTE';
}

function formatarStatus(status: string): string {
  switch (status) {
    case 'RESPONDIDO':
      return 'Respondido';
    case 'ACEITO':
      return 'Serviço Contratado';
    case 'RECUSADO':
      return 'Proposta Recusada';
    default:
      return 'Pendente';
  }
}

export default function OrcamentoSolicitadoCard({
  orcamento,
  processandoId,
  servicoContratado,
  onDecidir,
}: OrcamentoSolicitadoCardProps) {
  const status = extrairStatus(orcamento);
  const temResposta =
    orcamento.valorResposta != null || Boolean(orcamento.descricaoResposta);
  const estaProcessando = processandoId === orcamento.id;

  return (
    <article className="orcamento-card">
      <header className="orcamento-card-header">
        <div>
          <span className="orcamento-badge-servico">{orcamento.tituloServico}</span>
          <h3>Prestador: {orcamento.nomePrestador}</h3>
        </div>
        <span className={`badge-status status-${status.toLowerCase()}`}>
          {formatarStatus(status)}
        </span>
      </header>

      <div className="orcamento-detalhes-grid">
        <div>
          <strong>Local informado:</strong>
          <p>{orcamento.localAtendimento}</p>
        </div>
        <div>
          <strong>Período desejado:</strong>
          <p>{orcamento.dataOuPeriodoDesejado}</p>
        </div>
      </div>

      <div className="orcamento-descricao">
        <strong>Sua solicitação:</strong>
        <p>{orcamento.descricaoNecessidade}</p>
      </div>

      {temResposta && (
        <div className="orcamento-proposta-box">
          <h4>Proposta do Prestador</h4>
          {orcamento.valorResposta != null && (
            <p className="proposta-valor">
              Valor:{' '}
              <strong>
                {Number(orcamento.valorResposta).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </strong>
            </p>
          )}
          {orcamento.descricaoResposta && (
            <p className="proposta-condicoes">
              <strong>Condições / Detalhes:</strong> {orcamento.descricaoResposta}
            </p>
          )}
        </div>
      )}

      {status === 'RESPONDIDO' && !servicoContratado && (
        <div className="orcamento-card-actions">
          <button
            type="button"
            className="btn-recusar"
            disabled={estaProcessando}
            onClick={() => onDecidir(orcamento.id, 'recusar')}
          >
            Recusar Proposta
          </button>
          <button
            type="button"
            className="btn-aceitar"
            disabled={estaProcessando}
            onClick={() => onDecidir(orcamento.id, 'aceitar')}
          >
            {estaProcessando ? 'Processando...' : 'Aceitar Proposta'}
          </button>
        </div>
      )}

      {status === 'RESPONDIDO' && servicoContratado && (
        <div className="status-feedback status-feedback-recusado">
          Este serviço já foi contratado a partir de outro orçamento.
        </div>
      )}

      {status === 'ACEITO' && (
        <div className="status-feedback status-feedback-aceito">
          ✓ Serviço contratado! Você aceitou esta proposta.
        </div>
      )}

      {status === 'RECUSADO' && (
        <div className="status-feedback status-feedback-recusado">
          ✕ Você recusou esta proposta.
        </div>
      )}
    </article>
  );
}