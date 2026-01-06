import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Execucao, OutraData, Previsao } from '../types/Execucao';

type ExecucaoState = { execucao?: Execucao }
const initialState: ExecucaoState = { execucao: {
  previsao: undefined,
  outrasDatas: []
} }

const execucaoSlice = createSlice({
  name: 'execucao',
  initialState,
  reducers: {
    addOutraData: (state, action: PayloadAction<Omit<OutraData, 'id'>>) => {
      state.execucao?.outrasDatas?.push({...action.payload, id: Math.random()});
    },
    removerOutraData: (state, action: PayloadAction<number>) => {
      state.execucao = {...state, outrasDatas: state.execucao?.outrasDatas?.filter(outraData => outraData.id !== action.payload)}
    },
    editarOutraData: (state, action: PayloadAction<Omit<OutraData, 'nome'>>) => {
      state.execucao = {
        ...state, 
        outrasDatas: state.execucao?.outrasDatas?.map(outraData => 
          outraData.id === action.payload.id ? {...outraData, data: action.payload.data} : outraData)}
    },
    editarPrevisao: (state, action: PayloadAction<Previsao>) => {
      state.execucao = {...state, previsao: action.payload}
    }
  },
})

export const { addOutraData, removerOutraData, editarOutraData, editarPrevisao } = execucaoSlice.actions
export default execucaoSlice.reducer