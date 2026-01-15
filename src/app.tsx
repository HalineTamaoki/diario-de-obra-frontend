import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Obra } from './pages/Obra'
import { Layout } from './components/layout/Layout'
import { Provider } from 'react-redux';
import { store } from './app/store';
import './app.css';
import { DetalhesObra } from './pages/DetalhesObra';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Obra />} />
            <Route path=':nome' element={<DetalhesObra />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
