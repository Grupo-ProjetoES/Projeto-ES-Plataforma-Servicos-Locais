import { useNavigate } from 'react-router-dom';
import type { HistoricoServicoContratado } from '../../../models/historico-servico-contratado.model';

interface HistoricoServicoCardProps {
  readonly historico: HistoricoServicoContratado;
  readonly onAvaliar?: (id: number) => void;
}

function formatarStatus(status: string): string {
  switch (status) {
    case 'CONTRATADO':
      return 'Não iniciado';
    case 'EM_ANDAMENTO':
      return 'Em andamento';
    case 'REALIZADO':
      return 'Concluído';
    default:
      return status;
  }
}

function formatarData(dataIso: string): string {
  const data = new Date(dataIso);
  return data.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function HistoricoServicoCard({
  historico,
  onAvaliar,
}: HistoricoServicoCardProps) {
  const navigate = useNavigate();
  const statusFormatado = formatarStatus(historico.status);
  const classStatus = `status-${historico.status.toLowerCase().replace('_', '-')}`;
  const concluido = historico.status === 'REALIZADO';

  return (
    <article className="historico-servico-card">
      <header className="historico-servico-header">
        <div className="historico-servico-titulo-info">
          <h3 className="historico-servico-titulo">{historico.tituloServico}</h3>
          <span className={`historico-status-badge ${classStatus}`}>
            {statusFormatado}
          </span>
        </div>
      </header>

      <div className="historico-servico-detalhes">
        <div className="historico-item-detalhe">
          <span className="historico-label">Prestador:</span>
          <span className="historico-valor">{historico.nomePrestador}</span>
        </div>

        <div className="historico-item-detalhe">
          <span className="historico-label">Data da contratação:</span>
          <span className="historico-valor">{formatarData(historico.dataContratacao)}</span>
        </div>

        {concluido && (
          <div className="historico-item-detalhe">
            <span className="historico-label">Avaliação:</span>
            <span className="historico-valor">
              {historico.avaliado ? '✓ Já avaliado' : 'Pendente'}
            </span>
          </div>
        )}
      </div>

      <footer className="historico-servico-actions">
        {concluido && !historico.avaliado && onAvaliar && (
          <button
            type="button"
            className="historico-btn-avaliar"
            onClick={() => onAvaliar(historico.id)}
          >
            Avaliar Prestador
          </button>
        )}
        <button
          type="button"
          className="historico-btn-detalhes"
          onClick={() => navigate(`/servicos/${historico.id}`)}
        >
          Ver Serviço
        </button>
      </footer>
    </article>
  );
}
