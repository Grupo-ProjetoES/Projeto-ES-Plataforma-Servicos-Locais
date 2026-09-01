import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicoService } from '../../services/servico.service';
import type { ServicoDetalhe as ServicoDetalheModel } from '../../models/servico-detalhe.model';
import Logo from '../../components/Logo/Logo';
import './ServicoDetalhe.css';

const FORMA_COBRANCA_LABELS: Record<string, string> = {
  POR_HORA: 'Por hora',
  DIARIA: 'Diária',
  MENSALIDADE: 'Mensalidade',
  VALOR_FIXO_TOTAL: 'Valor fixo',
};

export default function ServicoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [servico, setServico] = useState<ServicoDetalheModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    let ativo = true;

    servicoService
      .buscarPorId(id)
      .then((data) => {
        if (!ativo) return;
        setServico(data);
        setErrorMessage('');
      })
      .catch(() => {
        if (ativo) setErrorMessage('Serviço não encontrado.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  return (
    <>
      <header className="servicos-topbar">
        <Logo />
      </header>

      <main className="servico-detalhe-page">
        <button type="button" className="btn-secondary btn-voltar" onClick={() => navigate('/servicos')}>
          ← Voltar para a busca
        </button>

        {loading && <div className="servicos-status">Carregando detalhes...</div>}
        {!loading && errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {!loading && servico && (
          <section className="servico-detalhe-card">
            <span className="servico-categoria">{servico.categoria}</span>
            <h1>{servico.titulo}</h1>
            <p className="servico-local">
              {servico.bairro}, {servico.cidade}
            </p>

            <div className="servico-info-grid">
              <div>
                <h2>Forma de cobrança</h2>
                <p>{FORMA_COBRANCA_LABELS[servico.formaCobranca] || servico.formaCobranca}</p>
              </div>
            </div>

            <div className="servico-secao">
              <h2>Descrição</h2>
              <p>{servico.descricao}</p>
            </div>

            <div className="servico-secao">
              <h2>Prestador</h2>
              <p className="servico-prestador-nome">{servico.nomePrestador}</p>
              <p>Telefone: {servico.telefonePrestador}</p>
              <h2>Sobre o Prestador</h2>
              {servico.descricaoPrestador && <p>{servico.descricaoPrestador}</p>}
            </div>

            <div className="servico-acoes">
              <button
                type="button"
                className="btn-solicitar-orcamento"
                onClick={() => navigate(`/servicos/${servico.id}/solicitar-orcamento`)}
              >
                Solicitar orçamento
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
