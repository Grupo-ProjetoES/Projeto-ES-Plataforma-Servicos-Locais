import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';
import type { ServicoComparacao } from '../../models/servico-comparacao.model';
import { servicoService } from '../../services/servico.service';
import './CompararServicos.css';

const FORMA_COBRANCA_LABELS: Record<string, string> = {
  POR_HORA: 'Por hora',
  DIARIA: 'Diária',
  MENSALIDADE: 'Mensalidade',
  VALOR_FIXO_TOTAL: 'Valor fixo',
};

export default function CompararServicos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [servicos, setServicos] = useState<ServicoComparacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const idsParam = searchParams.get('ids');
  const idsValidos = idsParam
    ? idsParam
        .split(',')
        .map((val) => Number(val.trim()))
        .filter((num) => !Number.isNaN(num) && num > 0)
    : [];

  useEffect(() => {
    if (idsValidos.length < 2 || idsValidos.length > 3) {
      setLoading(false);
      return;
    }

    let ativo = true;

    servicoService
      .comparar(idsValidos)
      .then((data) => {
        if (!ativo) return;
        setServicos(data);
        setErrorMessage('');
      })
      .catch(() => {
        if (!ativo) return;
        setErrorMessage('Não foi possível carregar a comparação de serviços.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [idsParam]);

  const handleRemover = (idParaRemover: number) => {
    setServicos((prev) => prev.filter((s) => s.id !== idParaRemover));
  };

  const formatarAvaliacao = (servico: ServicoComparacao) => {
    if (servico.notaMediaPrestador == null || servico.totalAvaliacoesPrestador === 0) {
      return 'Sem avaliações ainda';
    }
    const plural = servico.totalAvaliacoesPrestador === 1 ? 'avaliação' : 'avaliações';
    return `★ ${servico.notaMediaPrestador.toFixed(1)} (${servico.totalAvaliacoesPrestador} ${plural})`;
  };

  return (
    <>
      <header className="comparar-topbar">
        <Logo />
      </header>

      <main className="comparar-page">
        <div className="comparar-container">
          <button
            type="button"
            className="btn-voltar-busca"
            onClick={() => navigate('/servicos')}
          >
            ← Voltar para a busca
          </button>

          <header className="comparar-header">
            <h1>Comparação de Serviços</h1>
            <p>Compare informações essenciais lado a lado para tomar a melhor decisão.</p>
          </header>

          {loading && <div className="comparar-status">Carregando comparação...</div>}

          {!loading && errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          {!loading && !errorMessage && idsValidos.length < 2 && (
            <div className="comparar-status" data-testid="comparar-invalido">
              <p>Selecione ao menos 2 serviços na busca para realizar a comparação.</p>
              <button
                type="button"
                className="btn-ir-busca"
                onClick={() => navigate('/servicos')}
              >
                Ir para a busca de serviços
              </button>
            </div>
          )}

          {!loading && !errorMessage && idsValidos.length >= 2 && servicos.length < 2 && (
            <div className="comparar-status" data-testid="comparar-insuficiente">
              <p>Restam menos de 2 serviços na comparação.</p>
              <button
                type="button"
                className="btn-ir-busca"
                onClick={() => navigate('/servicos')}
              >
                Voltar para a busca e selecionar novos serviços
              </button>
            </div>
          )}

          {!loading && !errorMessage && servicos.length >= 2 && (
            <div className="comparar-grid" data-testid="comparar-grid">
              {servicos.map((servico) => (
                <section
                  key={servico.id}
                  className="comparar-coluna"
                  aria-label={`Comparação de ${servico.titulo}`}
                >
                  <div className="comparar-coluna-header">
                    <span className="servico-categoria">{servico.categoria}</span>
                    <button
                      type="button"
                      className="btn-remover-comparacao"
                      onClick={() => handleRemover(servico.id)}
                      aria-label={`Remover ${servico.titulo} da comparação`}
                    >
                      ✕ Remover
                    </button>
                  </div>

                  <h2 className="comparar-servico-titulo">{servico.titulo}</h2>

                  <div className="comparar-secao">
                    <span className="comparar-label">Localização</span>
                    <p className="comparar-valor">
                      {servico.bairro}, {servico.cidade}
                    </p>
                  </div>

                  <div className="comparar-secao">
                    <span className="comparar-label">Forma de cobrança</span>
                    <p className="comparar-valor">
                      {FORMA_COBRANCA_LABELS[servico.formaCobranca] || servico.formaCobranca}
                    </p>
                  </div>

                  <div className="comparar-secao">
                    <span className="comparar-label">Prestador</span>
                    <p className="comparar-valor">{servico.nomePrestador}</p>
                  </div>

                  <div className="comparar-secao">
                    <span className="comparar-label">Avaliação do prestador</span>
                    <p className="comparar-valor comparar-avaliacao">
                      {formatarAvaliacao(servico)}
                    </p>
                  </div>

                  <div className="comparar-acoes">
                    <button
                      type="button"
                      className="btn-comparar-detalhes"
                      onClick={() => navigate(`/servicos/${servico.id}`)}
                    >
                      Ver Detalhes
                    </button>
                    <button
                      type="button"
                      className="btn-comparar-orcamento"
                      onClick={() => navigate(`/servicos/${servico.id}/solicitar-orcamento`)}
                    >
                      Solicitar Orçamento
                    </button>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
