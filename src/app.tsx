import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Obra } from './pages/Obra'
import { Layout } from './components/layout/Layout'
import { Provider } from 'react-redux';
import { store } from './app/store';
import './app.css';
import { DetalhesObra } from './pages/DetalhesObra';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import PaginaNaoEncontrada from './pages/PaginaNaoEncontrada';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Layout />}>
              <Route index element={<Obra />} />
              <Route path=':nome' element={<DetalhesObra />} />
            </Route>
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<PaginaNaoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
