import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { servicoService } from '../../services/servico.service';
import type { ServicoResumo } from '../../models/servico-resumo.model';
import type { ServicoFiltro } from '../../models/servico-filtro.model';
import ServiceFilters from '../../components/ServiceFilters/ServiceFilters';
import Logo from '../../components/Logo/Logo';
import './Servicos.css';

export default function Servicos() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const filtrosAtuais: ServicoFiltro = useMemo(
    () => ({
      categoria: searchParams.get('categoria') || undefined,
      cidade: searchParams.get('cidade') || undefined,
      bairro: searchParams.get('bairro') || undefined,
    }),
    [searchParams],
  );

  const [servicos, setServicos] = useState<ServicoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [avisoLimite, setAvisoLimite] = useState('');

  useEffect(() => {
    let ativo = true;

    servicoService
      .buscar(filtrosAtuais)
      .then((resultados) => {
        if (!ativo) return;
        setServicos(resultados);
        setErrorMessage('');
      })
      .catch(() => {
        if (!ativo) return;
        setServicos([]);
        setErrorMessage('Não foi possível carregar os serviços. Tente novamente mais tarde.');
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, [filtrosAtuais]);

  const handleSearch = (filtros: ServicoFiltro) => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filtros.categoria) params.categoria = filtros.categoria;
    if (filtros.cidade) params.cidade = filtros.cidade;
    if (filtros.bairro) params.bairro = filtros.bairro;
    setSearchParams(params);
  };

  const handleToggleSelecionar = (id: number, checked: boolean) => {
    if (checked) {
      if (servicosSelecionados.length >= 3) {
        setAvisoLimite('Você pode selecionar no máximo 3 serviços para comparação.');
        return;
      }
      setAvisoLimite('');
      setServicosSelecionados((prev) => [...prev, id]);
    } else {
      setAvisoLimite('');
      setServicosSelecionados((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleLimparSelecao = () => {
    setServicosSelecionados([]);
    setAvisoLimite('');
  };

  const handleComparar = () => {
    if (servicosSelecionados.length >= 2) {
      navigate(`/servicos/comparar?ids=${servicosSelecionados.join(',')}`);
    }
  };

  return (
    <>
      <header className="servicos-topbar">
        <Logo />
      </header>

      <main className="servicos-page">
        <section className="servicos-header">
          <h1>Buscar Serviços</h1>
          <p>Encontre profissionais qualificados filtrando por categoria, cidade e bairro.</p>
        </section>

        <ServiceFilters
          key={searchParams.toString()}
          initialValues={filtrosAtuais}
          onSearch={handleSearch}
          loading={loading}
        />

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {avisoLimite && (
          <div className="alert alert-warning" role="alert">
            {avisoLimite}
          </div>
        )}

        {loading ? (
          <div className="servicos-status">Carregando serviços...</div>
        ) : !errorMessage && servicos.length === 0 ? (
          <div className="servicos-status">Nenhum resultado encontrado.</div>
        ) : (
          <div className="servicos-grid">
            {servicos.map((servico) => (
              <div
                key={servico.id}
                role="button"
                tabIndex={0}
                className={`servico-card ${servicosSelecionados.includes(servico.id) ? 'servico-card-selecionado' : ''}`}
                onClick={() => navigate(`/servicos/${servico.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/servicos/${servico.id}`);
                  }
                }}
              >
                <div className="servico-card-header">
                  <span className="servico-categoria">{servico.categoria}</span>
                  <label
                    className="servico-comparar-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={servicosSelecionados.includes(servico.id)}
                      onChange={(e) => handleToggleSelecionar(servico.id, e.target.checked)}
                      aria-label={`Comparar serviço ${servico.titulo}`}
                    />
                    <span>Comparar</span>
                  </label>
                </div>
                <h3>{servico.titulo}</h3>
                <p className="servico-local">
                  {servico.bairro}, {servico.cidade}
                </p>
                <p className="servico-prestador">Prestador: {servico.nomePrestador}</p>
              </div>
            ))}
          </div>
        )}

        {servicosSelecionados.length > 0 && (
          <aside className="comparacao-barra-flutuante" aria-label="Barra de comparação de serviços">
            <div className="comparacao-barra-conteudo">
              <div className="comparacao-barra-info">
                <span className="comparacao-contador" data-testid="comparacao-contador">
                  {servicosSelecionados.length}/3 selecionados
                </span>
                {avisoLimite && (
                  <span className="comparacao-aviso-inline" role="alert">
                    {avisoLimite}
                  </span>
                )}
              </div>
              <div className="comparacao-barra-acoes">
                <button
                  type="button"
                  className="btn-limpar-selecao"
                  onClick={handleLimparSelecao}
                >
                  Limpar seleção
                </button>
                <button
                  type="button"
                  className="btn-comparar-servicos"
                  onClick={handleComparar}
                  disabled={servicosSelecionados.length < 2}
                >
                  Comparar serviços
                </button>
              </div>
            </div>
          </aside>
        )}
      </main>
    </>
  );
}
