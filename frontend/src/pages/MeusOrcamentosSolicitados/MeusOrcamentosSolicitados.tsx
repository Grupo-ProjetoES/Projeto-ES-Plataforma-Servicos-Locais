import { useEffect, useState } from 'react';
import axios from 'axios';
import { orcamentoService } from '../../services/orcamento.service';
import type { OrcamentoResponse } from '../../models/orcamento-response.model';
import Logo from '../../components/Logo/Logo';
import OrcamentoSolicitadoCard from './components/OrcamentoSolicitadoCard';
import './MeusOrcamentosSolicitados.css';

function obterMensagemErro(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === 'string' && mensagem.trim()) {
      return mensagem;
    }
  }

  return 'Não foi possível processar sua solicitação. Tente novamente.';
}

export default function MeusOrcamentosSolicitados() {
  const [orcamentos, setOrcamentos] = useState<OrcamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const dados = await orcamentoService.listarOrcamentosSolicitados();
        if (!ativo) return;
        setOrcamentos(dados);
        setErrorMessage('');
      } catch (err) {
        if (!ativo) return;
        console.error('Erro ao buscar orçamentos do cliente:', err);
        setErrorMessage('Não foi possível carregar suas solicitações de orçamento.');
      } finally {
        if (ativo) setLoading(false);
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const handleDecisao = async (id: number, acao: 'aceitar' | 'recusar') => {
    const confirmacao = window.confirm(
      acao === 'aceitar'
        ? 'Deseja aceitar a proposta deste prestador?'
        : 'Tem certeza que deseja recusar este orçamento?'
    );
    if (!confirmacao) return;

    try {
      setProcessandoId(id);
      if (acao === 'aceitar') {
        await orcamentoService.aceitarOrcamento(id);
      } else {
        await orcamentoService.recusarOrcamento(id);
      }

      setOrcamentos((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status_resposta: acao === 'aceitar' ? 'ACEITO' : 'RECUSADO' }
            : item
        )
      );
    } catch (err) {
      console.error(`Erro ao ${acao} orçamento:`, err);
      setErrorMessage(obterMensagemErro(err));
    } finally {
      setProcessandoId(null);
    }
  };

  const servicosContratados = new Set(
    orcamentos
      .filter((item) => item.status_resposta === 'ACEITO')
      .map((item) => item.servicoId)
  );

  return (
    <>
      <header className="servicos-topbar">
        <Logo />
      </header>

      <main className="orcamentos-page">
        <div className="orcamentos-container">
          <header className="orcamentos-header">
            <h1>Minhas Solicitações de Orçamento</h1>
            <p>Acompanhe o andamento dos orçamentos que você pediu aos prestadores.</p>
          </header>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          {loading && <div className="orcamentos-status">Carregando solicitações...</div>}

          {!loading && orcamentos.length === 0 && (
            <div className="empty-state">
              <p>Você ainda não solicitou nenhum orçamento.</p>
            </div>
          )}

          {!loading && orcamentos.length > 0 && (
            <div className="orcamentos-list">
              {orcamentos.map((orcamento) => (
                <OrcamentoSolicitadoCard
                  key={orcamento.id}
                  orcamento={orcamento}
                  processandoId={processandoId}
                  servicoContratado={servicosContratados.has(orcamento.servicoId)}
                  onDecidir={handleDecisao}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}