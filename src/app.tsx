import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './app.css';
import { store } from './app/store';
import { AppRoutes } from './navigation/AppRoutes';

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  )
}
