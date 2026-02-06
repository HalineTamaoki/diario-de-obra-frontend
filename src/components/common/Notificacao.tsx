
import { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import type { RootState } from '../../app/store';
import { ocultarNotificacao } from '../../features/notificacaoSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';

export const Notificacao = ({className}: {className?: string}) => {
    const dispatch = useAppDispatch();
    const notificacao = useAppSelector((s: RootState) => s.notificacao.notificacao);

    useEffect(() => {
      if (notificacao) {
        const timer = setTimeout(() => {
          dispatch(ocultarNotificacao());
        }, 3000);

        return () => clearTimeout(timer);
      }
    }, [notificacao, dispatch]);

    if (!notificacao) return null;

    return (
      <Alert variant={notificacao.variant} className={`w-[90%] md:w-[50%] z-10 position-fixed py-2 flex align-items-center ${className ?? ''}`} dismissible>
        {notificacao.mensagem}
      </Alert>
    );
}