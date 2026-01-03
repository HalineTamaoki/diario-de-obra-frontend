import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrcamentoResumo } from '../types/Orcamento';

type OrcamentoState = { resumoOrcamentos: OrcamentoResumo[] }
const initialState: OrcamentoState = { resumoOrcamentos: [] }

const ideacaoSlice = createSlice({
  name: 'orcamentos',
  initialState,
  reducers: {
    selecionarOrcamento: (state, action: PayloadAction<number>) => {
      state.resumoOrcamentos.map(orcamento => orcamento.id === action.payload ? {...orcamento, selecionado: true} : {...orcamento, selecionado: false});
    },
    deletarOrcamento: (state, action: PayloadAction<number>) => {
      state.resumoOrcamentos = state.resumoOrcamentos.filter(orcamento => orcamento.id !== action.payload);
    },
  },
})

export const { selecionarOrcamento, deletarOrcamento } = ideacaoSlice.actions
export default ideacaoSlice.reducer