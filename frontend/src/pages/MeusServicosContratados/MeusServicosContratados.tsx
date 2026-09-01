import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';
import type { ServicoContratadoPrestador } from '../../models/servico-contratado-prestador.model';
import { servicoContratadoService } from '../../services/servico-contratado.service';
import ServicoContratadoPrestadorCard from './components/ServicoContratadoPrestadorCard';
import './MeusServicosContratados.css';

function obterMensagemErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === 'string' && mensagem.trim()) {
      return mensagem;
    }
  }

  return 'Não foi possível carregar os serviços sob sua responsabilidade. Tente novamente.';
}

export default function MeusServicosContratados() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<ServicoContratadoPrestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarServicos() {
      setLoading(true);
      setErrorMessage('');

      try {
        const dados = await servicoContratadoService.listarDoPrestador();
        if (!ativo) return;
        setServicos(dados);
      } catch (error: unknown) {
        if (!ativo) return;
        setServicos([]);
        setErrorMessage(obterMensagemErro(error));
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarServicos();

    return () => {
      ativo = false;
    };
  }, []);

  const handleAtualizarStatus = (id: number) => {
    navigate(`/meus-servicos/contratados/${id}`);
  };

  return (
    <>
      <header className="servicos-topbar">
        <Logo />
      </header>

      <main className="servicos-prestador-page">
        <div className="container">
          <header className="page-header">
            <h1>Serviços Sob Minha Responsabilidade</h1>
            <p>Visualize os atendimentos contratados que ainda não foram iniciados.</p>
          </header>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          {loading && <div className="status-loading">Carregando serviços sob sua responsabilidade...</div>}

          {!loading && !errorMessage && servicos.length === 0 && (
            <div className="empty-state">
              <p>Você não possui serviços contratados não iniciados no momento.</p>
            </div>
          )}

          {!loading && !errorMessage && servicos.length > 0 && (
            <div className="servicos-grid">
              {servicos.map((servico) => (
                <ServicoContratadoPrestadorCard
                  key={servico.id}
                  servico={servico}
                  onAtualizarStatus={handleAtualizarStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
