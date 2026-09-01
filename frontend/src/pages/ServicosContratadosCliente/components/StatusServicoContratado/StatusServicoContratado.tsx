import type { StatusServicoContratado as Status } from '../../../../models/servico-contratado.model';
import './StatusServicoContratado.css';

interface StatusServicoContratadoProps {
  status: Status;
}

const STATUS_LABELS: Record<Status, string> = {
  CONTRATADO: 'Contratado',
  EM_ANDAMENTO: 'Em andamento',
  REALIZADO: 'Realizado',
};

export default function StatusServicoContratado({ status }: StatusServicoContratadoProps) {
  return (
    <span className={`status-servico-contratado status-${status.toLowerCase()}`}>
      <span className="status-servico-indicador" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}
