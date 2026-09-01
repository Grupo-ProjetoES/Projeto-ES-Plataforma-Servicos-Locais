import { Routes, Route, Navigate } from 'react-router-dom';
import CadastroServico from '../pages/CadastroServico/CadastroServico';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';
import PrivateRoute from '../routes/PrivateRoute';
import BecomeProvider from '../pages/BecomeProvider/BecomeProvider';
import Servicos from '../pages/Servicos/Servicos';
import ServicoDetalhe from '../pages/ServicoDetalhe/ServicoDetalhe';
import MeusServicos from '../pages/MeusServicos/MeusServicos';
import ServicosContratadosCliente from '../pages/ServicosContratadosCliente/ServicosContratadosCliente';
import SolicitarOrcamento from '../pages/SolicitarOrcamento/SolicitarOrcamento';
import AvaliarPrestador from '../pages/AvaliarPrestador/AvaliarPrestador';
import OrcamentosRecebidos from '../pages/OrcamentosRecebidos/OrcamentosRecebidos';
import MeusOrcamentosSolicitados from '../pages/MeusOrcamentosSolicitados/MeusOrcamentosSolicitados';
import MeusServicosContratados from '../pages/MeusServicosContratados/MeusServicosContratados';
import AtualizarStatusServico from '../pages/AtualizarStatusServico/AtualizarStatusServico';
import HistoricoServicosContratados from '../pages/HistoricoServicosContratados/HistoricoServicosContratados';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas Protegidas (Todas as rotas filhas exigem autenticação) */}
      <Route element={<PrivateRoute allowedRoles={['USER', 'ADMIN', 'PRESTADOR']} />}>
        <Route path="/become-provider" element={<BecomeProvider />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servicos/:id" element={<ServicoDetalhe />} />
        <Route
          path="/servicos/:id/solicitar-orcamento"
          element={<SolicitarOrcamento />}
        />
        <Route
          path="/servicos/:id/avaliar-prestador"
          element={<AvaliarPrestador />}
        />
        <Route path="/meus-orcamentos" element={<MeusOrcamentosSolicitados />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['USER']} requireRole />}>
        <Route path="/meus-servicos-contratados" element={<ServicosContratadosCliente />} />
        <Route path="/historico" element={<HistoricoServicosContratados />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['PRESTADOR']} requireRole />}>
        <Route path="/servicos/cadastrar" element={<CadastroServico />} />
        <Route path="/meus-servicos" element={<MeusServicos />} />
        <Route path="/meus-servicos/orcamentos/:id" element={<OrcamentosRecebidos />} />
        <Route path="/meus-servicos/contratados" element={<MeusServicosContratados />} />
        <Route path="/meus-servicos/contratados/:id" element={<AtualizarStatusServico />} />
      </Route>

      {/* Redirecionamento para rota não encontrada ou padrão */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
