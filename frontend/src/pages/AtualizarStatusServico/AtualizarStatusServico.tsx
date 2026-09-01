import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';
import type { ServicoContratadoPrestador } from '../../models/servico-contratado-prestador.model';
import type { ServicoDetalhe } from '../../models/servico-detalhe.model';
import {
  STATUS_SERVICO_LABELS,
  TRANSOES_PERMITIDAS,
  type StatusServico,
} from '../../models/servico-status.enum';
import { servicoService } from '../../services/servico.service';
import './AtualizarStatusServico.css';

function obterMensagemErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === 'string' && mensagem.trim()) {
      return mensagem;
    }

    if (error.response?.status === 403) {
      return 'Você não tem permissão para atualizar este serviço.';
    }

    if (error.response?.status === 404) {
      return 'O serviço informado não foi encontrado.';
    }

    if (error.response?.status === 400) {
      return 'Mudança de status não permitida.';
    }
  }

  return 'Não foi possível atualizar o status do serviço. Tente novamente.';
}

export default function AtualizarStatusServico() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const servicoId = Number(id);
  const servicoIdValido = Number.isInteger(servicoId) && servicoId > 0;
  const servicoContratado = location.state as ServicoContratadoPrestador | undefined;

  const [servico, setServico] = useState<ServicoDetalhe | null>(null);
  const [statusAtual, setStatusAtual] = useState<StatusServico>(
    servicoContratado?.statusAtual ?? 'CONTRATADO'
  );
  const [loading, setLoading] = useState(servicoIdValido);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!servicoIdValido) return;

    let ativo = true;

    servicoService
      .buscarPorId(servicoId)
      .then((data) => {
        if (!ativo) return;
        setServico(data);
        setErrorMessage('');
      })
      .catch((error: unknown) => {
        if (!ativo) return;
        setErrorMessage(obterMensagemErro(error));
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [servicoId, servicoIdValido]);

  const proximosStatus = useMemo(
    () => TRANSOES_PERMITIDAS[statusAtual] ?? [],
    [statusAtual]
  );

  const handleAtualizarStatus = async (novoStatus: StatusServico) => {
    if (!servicoIdValido) {
      setErrorMessage('Não foi possível identificar o serviço a ser atualizado.');
      return;
    }

    setUpdating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await servicoService.atualizarStatus(servicoId, novoStatus);
      setStatusAtual(novoStatus);
      setSuccessMessage(`Status atualizado para ${STATUS_SERVICO_LABELS[novoStatus]}.`);
    } catch (error: unknown) {
      setErrorMessage(obterMensagemErro(error));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <header className="servicos-topbar">
        <Logo />
      </header>

      <main className="servicos-prestador-page">
        <div className="container">
          <button
            type="button"
            className="status-update-back-button"
            onClick={() => navigate('/meus-servicos/contratados')}
          >
            ← Voltar para serviços sob minha responsabilidade
          </button>

          <header className="page-header">
            <h1>Atualização de status do serviço</h1>
            <p>Atualize o andamento do atendimento contratado sob sua responsabilidade.</p>
          </header>

          {loading && (
            <div className="status-update-state" role="status">
              Carregando dados do serviço...
            </div>
          )}

          {!loading && !servicoIdValido && (
            <div className="alert alert-danger" role="alert">
              Serviço inválido.
            </div>
          )}

          {!loading && errorMessage && !servico && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          {!loading && servico && (
            <section className="status-update-card" aria-labelledby="status-update-title">
              <header className="status-update-header">
                <span className="status-update-eyebrow">Atendimento contratado</span>
                <h2 id="status-update-title">{servico.titulo}</h2>
                <p>
                  Revise os dados do atendimento e siga para a próxima transição permitida.
                </p>
              </header>

              <aside className="status-update-summary" aria-label="Resumo do atendimento">
                <div>
                  <span>Status atual</span>
                  <strong>{STATUS_SERVICO_LABELS[statusAtual] ?? statusAtual}</strong>
                </div>
                <div>
                  <span>Categoria</span>
                  <strong>{servico.categoria}</strong>
                </div>
                <div>
                  <span>Contratante</span>
                  <strong>{servicoContratado?.nomeContratante ?? 'Não informado'}</strong>
                </div>
                <div>
                  <span>Data ou período</span>
                  <strong>{servicoContratado?.dataOuPeriodoSolicitado ?? 'Não informado'}</strong>
                </div>
              </aside>

              <dl className="status-update-details">
                <div>
                  <dt>Descrição do serviço</dt>
                  <dd>{servico.descricao}</dd>
                </div>
                <div>
                  <dt>Prestador responsável</dt>
                  <dd>{servico.nomePrestador}</dd>
                </div>
                <div>
                  <dt>Telefone</dt>
                  <dd>{servico.telefonePrestador}</dd>
                </div>
                <div>
                  <dt>Área de atendimento</dt>
                  <dd>
                    {servico.bairro}, {servico.cidade}
                  </dd>
                </div>
              </dl>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success" role="status">
                  {successMessage}
                </div>
              )}

              <footer className="status-update-actions">
                {proximosStatus.length === 0 ? (
                  <p className="status-update-helper">
                    Nenhuma transição adicional está disponível para este serviço.
                  </p>
                ) : (
                  proximosStatus.map((novoStatus) => (
                    <button
                      key={novoStatus}
                      type="button"
                      className="servico-prestador-atendimento-button"
                      disabled={updating}
                      onClick={() => handleAtualizarStatus(novoStatus)}
                    >
                      {updating
                        ? 'Atualizando status...'
                        : `Alterar para ${STATUS_SERVICO_LABELS[novoStatus]}`}
                    </button>
                  ))
                )}
              </footer>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
