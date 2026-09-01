import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';
import type { HistoricoServicoContratado } from '../../models/historico-servico-contratado.model';
import { servicoContratadoService } from '../../services/servico-contratado.service';
import HistoricoServicoCard from './components/HistoricoServicoCard';
import './HistoricoServicosContratados.css';

function obterMensagemErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === 'string' && mensagem.trim()) {
      return mensagem;
    }
  }

  return 'Não foi possível carregar o histórico de serviços. Tente novamente.';
}

export default function HistoricoServicosContratados() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState<HistoricoServicoContratado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarHistorico() {
      setLoading(true);
      setErrorMessage('');

      try {
        const dados = await servicoContratadoService.listarHistorico();
        if (!ativo) return;
        setHistorico(dados);
      } catch (error: unknown) {
        if (!ativo) return;
        setHistorico([]);
        setErrorMessage(obterMensagemErro(error));
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarHistorico();

    return () => {
      ativo = false;
    };
  }, []);

  const handleAvaliar = (servicoId: number) => {
    navigate(`/servicos/${servicoId}/avaliar-prestador`);
  };

  return (
    <>
      <header className="servicos-topbar">
        <Logo />
      </header>

      <main className="historico-page">
        <div className="historico-container">
          <header className="historico-page-header">
            <h1>Histórico de Serviços Contratados</h1>
            <p>Acompanhe todos os serviços que você já contratou e suas avaliações.</p>
          </header>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          {loading && <div className="historico-status-loading">Carregando histórico...</div>}

          {!loading && !errorMessage && historico.length === 0 && (
            <div className="historico-empty-state">
              <p>Você ainda não contratou nenhum serviço.</p>
            </div>
          )}

          {!loading && !errorMessage && historico.length > 0 && (
            <div className="historico-lista">
              {historico.map((item) => (
                <HistoricoServicoCard
                  key={item.id}
                  historico={item}
                  onAvaliar={handleAvaliar}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
