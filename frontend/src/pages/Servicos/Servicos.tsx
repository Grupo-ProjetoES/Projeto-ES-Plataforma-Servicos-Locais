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

  const [servicos, setServicos] = useState<ServicoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [categoriaComparacao, setCategoriaComparacao] = useState<string | null>(null);
  const [avisoLimite, setAvisoLimite] = useState('');

  const filtrosAtuais: ServicoFiltro = useMemo(
    () => ({
      categoria: searchParams.get('categoria') || undefined,
      cidade: searchParams.get('cidade') || undefined,
      bairro: searchParams.get('bairro') || undefined,
    }),
    [searchParams]
  );

  useEffect(() => {
    let ativo = true;

    servicoService
      .buscar(filtrosAtuais)
      .then((resultados) => {
        if (!ativo) return;
        setServicos(resultados);
        setErrorMessage('');
        if (
          categoriaComparacao &&
          filtrosAtuais.categoria &&
          filtrosAtuais.categoria !== categoriaComparacao
        ) {
          setServicosSelecionados([]);
          setCategoriaComparacao(null);
          setAvisoLimite('');
        }
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
  }, [filtrosAtuais, categoriaComparacao]);

  const handleSearch = (filtros: ServicoFiltro) => {
    setLoading(true);
    if (categoriaComparacao && filtros.categoria && filtros.categoria !== categoriaComparacao) {
      setServicosSelecionados([]);
      setCategoriaComparacao(null);
      setAvisoLimite('');
    }
    const params: Record<string, string> = {};
    if (filtros.categoria) params.categoria = filtros.categoria;
    if (filtros.cidade) params.cidade = filtros.cidade;
    if (filtros.bairro) params.bairro = filtros.bairro;
    setSearchParams(params);
  };

  const handleToggleSelecionar = (servico: ServicoResumo, checked: boolean) => {
    if (checked) {
      if (categoriaComparacao && servico.categoria !== categoriaComparacao) {
        setAvisoLimite(`Só é possível comparar serviços da mesma categoria (${categoriaComparacao}).`);
        return;
      }
      if (servicosSelecionados.length >= 3) {
        setAvisoLimite('Você pode selecionar no máximo 3 serviços para comparação.');
        return;
      }
      setAvisoLimite('');
      if (!categoriaComparacao) {
        setCategoriaComparacao(servico.categoria);
      }
      setServicosSelecionados((prev) => [...prev, servico.id]);
    } else {
      setAvisoLimite('');
      const novosSelecionados = servicosSelecionados.filter((item) => item !== servico.id);
      setServicosSelecionados(novosSelecionados);
      if (novosSelecionados.length === 0) {
        setCategoriaComparacao(null);
      }
    }
  };

  const handleLimparSelecao = () => {
    setServicosSelecionados([]);
    setCategoriaComparacao(null);
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
            {servicos.map((servico) => {
              const isSelecionado = servicosSelecionados.includes(servico.id);
              const isOutraCategoria = Boolean(
                categoriaComparacao && servico.categoria !== categoriaComparacao
              );
              const atingiuLimite = servicosSelecionados.length >= 3 && !isSelecionado;
              const isDisabled = isOutraCategoria || atingiuLimite;
              let disabledTitle = '';
              if (isOutraCategoria) {
                disabledTitle = `Só é possível comparar serviços da mesma categoria (${categoriaComparacao}).`;
              } else if (atingiuLimite) {
                disabledTitle = 'Você pode selecionar no máximo 3 serviços para comparação.';
              }

              return (
                <div
                  key={servico.id}
                  role="button"
                  tabIndex={0}
                  className={`servico-card ${
                    isSelecionado ? 'servico-card-selecionado' : ''
                  } ${isDisabled ? 'servico-card-desabilitado' : ''}`}
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
                      className={`servico-comparar-checkbox ${
                        isDisabled ? 'servico-comparar-checkbox-disabled' : ''
                      }`}
                      onClick={(e) => e.stopPropagation()}
                      title={disabledTitle || undefined}
                    >
                      <input
                        type="checkbox"
                        checked={isSelecionado}
                        aria-disabled={isDisabled}
                        onChange={(e) => handleToggleSelecionar(servico, e.target.checked)}
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
              );
            })}
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
