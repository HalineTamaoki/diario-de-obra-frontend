import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Obra } from './pages/Obra'
import { Layout } from './components/layout/Layout'
import { Provider } from 'react-redux';
import { store } from './app/store';
import './app.css';
import { DetalhesObra } from './pages/DetalhesObra';
import { NovoOrcamento } from './components/detalhesObra/orcamento/NovoOrcamento';
import { OrcamentoDetalhes } from './components/detalhesObra/orcamento/OrcamentoDetalhes';
import { OutraDataForm } from './components/detalhesObra/execucao/OutraDataForm';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Obra />} />
            <Route path=':idObra' element={<DetalhesObra />} />
            <Route path='/orcamento/:idObra/:idItem/novo' element={<NovoOrcamento />} />
            <Route path='/orcamento/:idObra/:idItem/:idOrcamento' element={<OrcamentoDetalhes />} />
            <Route path='/nova-data/:idObra/:idItem' element={<OutraDataForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
