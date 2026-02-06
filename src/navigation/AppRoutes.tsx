import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { OutraDataForm } from "../components/detalhesObra/execucao/OutraDataForm";
import { NovoOrcamento } from "../components/detalhesObra/orcamento/NovoOrcamento";
import { OrcamentoDetalhes } from "../components/detalhesObra/orcamento/OrcamentoDetalhes";
import { Layout } from "../components/layout/Layout";
import { DetalhesObra } from "../pages/DetalhesObra";
import { Obra } from "../pages/Obra";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { CadastroUsuario } from "../pages/CadastroUsuario";
import { Login } from "../pages/Login";
import PaginaNaoEncontrada from "../pages/PaginaNaoEncontrada";

export const AppRoutes = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ultimaObra = sessionStorage.getItem('ultimaObraVista');
    if (ultimaObra && window.location.pathname === '/') {
      if(ultimaObra === '0') {
        sessionStorage.removeItem('ultimaObraVista');
      } else {
        navigate(`/obra/${ultimaObra}`, { replace: true });
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Layout />}>
            <Route index element={<Obra />} />
            <Route path='/obra/:idObra' element={<DetalhesObra />} />
            <Route path='/obra/:idObra/orcamento/:idItem/novo' element={<NovoOrcamento />} />
            <Route path='/obra/:idObra/orcamento/:idItem/:idOrcamento' element={<OrcamentoDetalhes />} />
            <Route path='/obra/:idObra/nova-data/:idItem' element={<OutraDataForm />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/cadastro' element={<CadastroUsuario />} />
        </Route>      
        <Route path='*' element={<PaginaNaoEncontrada />} />
      </Routes>
  );
}