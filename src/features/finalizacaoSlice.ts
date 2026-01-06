import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Finalizacao } from '../types/Finalizacao';

type FinalizacaoState = { finalizacao?: Finalizacao }
const initialState: FinalizacaoState = { finalizacao: {}}

const finalizacaoSlice = createSlice({
  name: 'finalizacao',
  initialState,
  reducers: {
    editarData: (state, action: PayloadAction<string | undefined>) => {
      state.finalizacao = {...state.finalizacao, data: action.payload}
    },
    editarComentario: (state, action: PayloadAction<string>) => {
      state.finalizacao = {...state.finalizacao, comentarios: action.payload}
    }
  },
})

export const { editarData, editarComentario } = finalizacaoSlice.actions
export default finalizacaoSlice.reducer