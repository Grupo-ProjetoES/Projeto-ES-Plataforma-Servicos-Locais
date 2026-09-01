import { useNavigate, useParams } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';

export default function AtualizarStatusServico() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <header className="servicos-topbar">
        <Logo />
      </header>

      <main className="servicos-prestador-page">
        <div className="container">
          <header className="page-header">
            <h1>Atualização de status do serviço</h1>
            <p>Fluxo de atualização de status para o serviço #{id}.</p>
          </header>

          <div className="empty-state">
            <p>O fluxo detalhado de atualização de status será implementado na US12.</p>
            <button
              type="button"
              className="servico-prestador-atendimento-button"
              onClick={() => navigate('/meus-servicos/contratados')}
            >
              Voltar para serviços sob minha responsabilidade
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
