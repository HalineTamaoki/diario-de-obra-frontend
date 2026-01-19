import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Notificacao = {
    variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light",
    mensagem: string,
}
type NotificacaoState = {notificacao: Notificacao | null};
const initialState: NotificacaoState = {notificacao: null}

const notificacaoSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    mostrarNotificacao: (state, action: PayloadAction<Notificacao>) => {
      state.notificacao = action.payload;

      setTimeout(() => {
        state.notificacao = null;
      }, 3000);
    },
  },
})

export const { mostrarNotificacao } = notificacaoSlice.actions
export default notificacaoSlice.reducer