
import Alert from 'react-bootstrap/Alert';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

export const Notificacao = () => {
    const notificacao = useSelector((s: RootState) => s.notificacao.notificacao);

  return (
    <>
      {notificacao && (
        <Alert variant={notificacao.variant}>
          {notificacao.mensagem}
        </Alert>
      )}
    </>
  );
}