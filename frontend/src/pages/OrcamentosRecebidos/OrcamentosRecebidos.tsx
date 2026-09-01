import { useEffect, useState } from 'react';
import { orcamentoService } from '../../services/orcamento.service';
import type { OrcamentoResponse } from '../../models/orcamento-response.model';
import Logo from '../../components/Logo/Logo';
import OrcamentoRecebidoCard from './components/OrcamentoRecebidoCard';
import ModalResponderOrcamento from './components/ModalResponderOrcamento';
import './OrcamentoRecebidos.css';

export default function OrcamentosRecebidos() {
  const [orcamentos, setOrcamentos] = useState<OrcamentoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<OrcamentoResponse | null>(null);

  useEffect(() => {
    let ativo = true;

    async function buscarDados() {
      try {
        const dados = await orcamentoService.listarOrcamentosRecebidos();
        if (!ativo) return;
        setOrcamentos(dados);
        setErrorMessage('');
      } catch (err) {
        if (!ativo) return;
        console.error('Erro ao carregar orçamentos:', err);
        setErrorMessage('Não foi possível carregar as solicitações de orçamento.');
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    buscarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const handleSucessoResposta = (orcamentoId: number, valor?: number, condicoes?: string) => {
    setOrcamentos((prev) =>
      prev.map((item) =>
        item.id === orcamentoId
          ? {
              ...item,
              valorResposta: valor,
              descricaoResposta: condicoes,
              statusResposta: 'RESPONDIDO',
            }
          : item,
      ),
    );
  };

  const handleFecharModal = () => {
    setOrcamentoSelecionado(null);
  };

  return (
    <>
      <header className="servicos-topbar">
        <Logo />
      </header>

      <main className="orcamentos-page">
        <div className="orcamentos-container">
          <header className="orcamentos-header">
            <h1>Solicitações de Orçamento</h1>
            <p>Visualize as solicitações recebidas e envie o valor ou condições do serviço.</p>
          </header>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          {loading && <div className="orcamentos-status">Carregando solicitações...</div>}

          {!loading && orcamentos.length === 0 && (
            <div className="empty-state">
              <p>Nenhuma solicitação de orçamento recebida até o momento.</p>
            </div>
          )}

          {!loading && orcamentos.length > 0 && (
            <div className="orcamentos-list">
              {orcamentos.map((orcamento) => (
                <OrcamentoRecebidoCard
                  key={orcamento.id}
                  orcamento={orcamento}
                  onResponder={setOrcamentoSelecionado}
                />
              ))}
            </div>
          )}
        </div>

        {orcamentoSelecionado && (
          <ModalResponderOrcamento
            orcamento={orcamentoSelecionado}
            onClose={handleFecharModal}
            onSucesso={handleSucessoResposta}
          />
        )}
      </main>
    </>
  );
}