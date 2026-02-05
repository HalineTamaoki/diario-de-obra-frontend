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
      navigate(`/${ultimaObra}`, { replace: true });
    }
    setLoading(false);
  }, [navigate]);

  if (loading) return null;

  return (
    <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Layout />}>
            <Route index element={<Obra />} />
            <Route path=':nome' element={<DetalhesObra />} />
            <Route index element={<Obra />} />
            <Route path=':idObra' element={<DetalhesObra />} />
            <Route path='/orcamento/:idObra/:idItem/novo' element={<NovoOrcamento />} />
            <Route path='/orcamento/:idObra/:idItem/:idOrcamento' element={<OrcamentoDetalhes />} />
            <Route path='/nova-data/:idObra/:idItem' element={<OutraDataForm />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/cadastro' element={<CadastroUsuario />} />
        </Route>      
        <Route path='*' element={<PaginaNaoEncontrada />} />
      </Routes>
  );
}