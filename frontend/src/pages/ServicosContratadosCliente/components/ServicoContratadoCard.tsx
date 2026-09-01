import type { ServicoContratado } from '../../../models/servico-contratado.model';
import StatusServicoContratado from './StatusServicoContratado/StatusServicoContratado';

interface ServicoContratadoCardProps {
  servico: ServicoContratado;
  onVerDetalhes: (id: number) => void;
}

export default function ServicoContratadoCard({
  servico,
  onVerDetalhes,
}: ServicoContratadoCardProps) {
  return (
    <article className="servico-contratado-card">
      <header className="servico-contratado-card-header">
        <span className="servico-contratado-categoria">{servico.categoria}</span>
        <StatusServicoContratado status={servico.statusAtual} />
      </header>

      <div className="servico-contratado-card-content">
        <h2>{servico.titulo}</h2>
        <dl className="servico-contratado-informacoes">
          <div>
            <dt>Prestador</dt>
            <dd>{servico.nomePrestador}</dd>
          </div>
          <div>
            <dt>Local do serviço</dt>
            <dd>
              {servico.bairro}, {servico.cidade}
            </dd>
          </div>
        </dl>
      </div>

      <footer className="servico-contratado-card-actions">
        <button
          type="button"
          className="servico-contratado-button-secondary"
          onClick={() => onVerDetalhes(servico.id)}
        >
          Ver detalhes
        </button>
      </footer>
    </article>
  );
}
