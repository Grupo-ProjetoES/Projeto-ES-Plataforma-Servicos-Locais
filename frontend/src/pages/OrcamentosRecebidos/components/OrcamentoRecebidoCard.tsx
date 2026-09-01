import type { OrcamentoResponse } from '../../../models/orcamento-response.model';

interface OrcamentoRecebidoCardProps {
  readonly orcamento: OrcamentoResponse;
  readonly onResponder: (orcamento: OrcamentoResponse) => void;
}

export default function OrcamentoRecebidoCard({
  orcamento,
  onResponder,
}: OrcamentoRecebidoCardProps) {
  const temResposta =
    orcamento.valorResposta != null || Boolean(orcamento.descricaoResposta);

  return (
    <article className="orcamento-card">
      <header className="orcamento-card-header">
        <div>
          <span className="orcamento-badge-servico">{orcamento.tituloServico}</span>
          <h3>Solicitante: {orcamento.nomeSolicitante}</h3>
          <p className="orcamento-email">Contato: {orcamento.emailSolicitante}</p>
        </div>
      </header>

      <div className="orcamento-detalhes-grid">
        <div>
          <strong>Local de atendimento:</strong>
          <p>{orcamento.localAtendimento}</p>
        </div>
        <div>
          <strong>Período desejado:</strong>
          <p>{orcamento.dataOuPeriodoDesejado}</p>
        </div>
      </div>

      <div className="orcamento-descricao">
        <strong>Descrição da necessidade:</strong>
        <p>{orcamento.descricaoNecessidade}</p>
      </div>

      {temResposta && (
        <div className="orcamento-resposta-box">
          <strong>Sua resposta:</strong>
          {orcamento.valorResposta != null && (
            <p>
              Valor:{' '}
              {Number(orcamento.valorResposta).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          )}
          {orcamento.descricaoResposta && (
            <p>Descrição: {orcamento.descricaoResposta}</p>
          )}
        </div>
      )}

      <div className="orcamento-card-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => onResponder(orcamento)}
        >
          {temResposta ? 'Editar resposta' : 'Responder orçamento'}
        </button>
      </div>
    </article>
  );
}