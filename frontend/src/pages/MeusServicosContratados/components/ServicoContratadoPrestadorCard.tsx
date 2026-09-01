import type { ServicoContratadoPrestador } from '../../../models/servico-contratado-prestador.model';

interface ServicoContratadoPrestadorCardProps {
  servico: ServicoContratadoPrestador;
  onAtualizarStatus: (id: number) => void;
}

export default function ServicoContratadoPrestadorCard({
  servico,
  onAtualizarStatus,
}: ServicoContratadoPrestadorCardProps) {
  return (
    <article className="servico-prestador-atendimento-card">
      <header className="servico-prestador-atendimento-header">
        <span className="servico-prestador-atendimento-categoria">{servico.categoria}</span>
        <span className="servico-prestador-atendimento-status">{servico.statusAtual}</span>
      </header>

      <div className="servico-prestador-atendimento-content">
        <h2>{servico.titulo}</h2>

        <dl className="servico-prestador-atendimento-informacoes">
          <div>
            <dt>Contratante</dt>
            <dd>{servico.nomeContratante}</dd>
          </div>

          <div>
            <dt>Local de atendimento</dt>
            <dd>{servico.localAtendimento}</dd>
          </div>

          <div>
            <dt>Data ou período solicitado</dt>
            <dd>{servico.dataOuPeriodoSolicitado}</dd>
          </div>
        </dl>
      </div>

      <footer className="servico-prestador-atendimento-actions">
        <button
          type="button"
          className="servico-prestador-atendimento-button"
          onClick={() => onAtualizarStatus(servico.id)}
        >
          Atualizar status
        </button>
      </footer>
    </article>
  );
}
