import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Obra } from './pages/Obra'
import { Layout } from './components/layout/Layout'

export function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Obra />}/>          
      </Routes>
    </BrowserRouter>
  )
}
