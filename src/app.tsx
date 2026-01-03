import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Obra } from './pages/Obra'
import { Layout } from './components/layout/Layout'
import { Provider } from 'react-redux';
import { store } from './app/store';
import './app.css';
import { DetalhesObra } from './pages/DetalhesObra';
import { NovoOrcamento } from './components/detalhesObra/orcamento/NovoOrcamento';
import { OrcamentoDetalhes } from './components/detalhesObra/orcamento/OrcamentoDetalhes';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Obra />} />
            <Route path=':nome' element={<DetalhesObra />} />
            <Route path='/orcamento/novo/:id' element={<NovoOrcamento />} />
            <Route path='/orcamento/:id' element={<OrcamentoDetalhes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
