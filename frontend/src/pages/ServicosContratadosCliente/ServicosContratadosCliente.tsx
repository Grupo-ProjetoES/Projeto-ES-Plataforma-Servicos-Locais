import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../components/Logo/Logo';
import type { ServicoContratado } from '../../models/servico-contratado.model';
import { servicoContratadoService } from '../../services/servico-contratado.service';
import ServicoContratadoCard from './components/ServicoContratadoCard';
import './ServicosContratadosCliente.css';

function obterMensagemErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === 'string' && mensagem.trim()) {
      return mensagem;
    }
  }

  return 'Não foi possível carregar seus serviços contratados. Tente novamente.';
}

export default function ServicosContratadosCliente() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<ServicoContratado[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarServicos() {
      setLoading(true);
      setErrorMessage('');

      try {
        const dados = await servicoContratadoService.listar();
        if (ativo) setServicos(dados);
      } catch (error: unknown) {
        if (ativo) {
          setServicos([]);
          setErrorMessage(obterMensagemErro(error));
        }
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarServicos();

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const tentarNovamente = () => {
    setTentativa((valorAtual) => valorAtual + 1);
  };

  return (
    <>
      <header className="servicos-contratados-topbar">
        <Logo />
      </header>

      <main className="servicos-contratados-page">
        <section className="servicos-contratados-container" aria-labelledby="servicos-contratados-title">
          <header className="servicos-contratados-header">
            <div className="servicos-contratados-header-top">
              <div>
                <span className="servicos-contratados-eyebrow">Acompanhamento</span>
                <h1 id="servicos-contratados-title">Meus serviços contratados</h1>
                <p>Acompanhe o andamento dos serviços contratados. As avaliações são feitas no histórico após a conclusão.</p>
              </div>
              <button 
                type="button" 
                className="servicos-contratados-btn-historico"
                onClick={() => navigate('/historico')}
                aria-label="Ver histórico de serviços concluídos"
              >
                📋 Histórico
              </button>
            </div>
          </header>

          {loading && (
            <div className="servicos-contratados-state" role="status">
              Carregando serviços contratados...
            </div>
          )}

          {!loading && errorMessage && (
            <div className="servicos-contratados-state servicos-contratados-error" role="alert">
              <strong>Não foi possível carregar a página.</strong>
              <p>{errorMessage}</p>
              <button type="button" onClick={tentarNovamente}>
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !errorMessage && servicos.length === 0 && (
            <div className="servicos-contratados-state servicos-contratados-empty">
              <span aria-hidden="true">✓</span>
              <strong>Você ainda não possui serviços contratados.</strong>
              <p>Quando uma proposta for aceita, o serviço aparecerá aqui para acompanhamento.</p>
              <button type="button" onClick={() => navigate('/servicos')}>
                Buscar serviços
              </button>
            </div>
          )}

          {!loading && !errorMessage && servicos.length > 0 && (
            <div className="servicos-contratados-grid">
              {servicos.map((servico) => (
                <ServicoContratadoCard
                  key={servico.id}
                  servico={servico}
                  onVerDetalhes={(id) => navigate(`/servicos/${id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
