import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrcamentoResumo } from '../types/Orcamento';

type OrcamentoState = { resumoOrcamentos: OrcamentoResumo[] }
const initialState: OrcamentoState = { resumoOrcamentos: [] }

const ideacaoSlice = createSlice({
  name: 'orcamentos',
  initialState,
  reducers: {
    selecionar: (state, action: PayloadAction<number>) => {
      state.resumoOrcamentos.map(orcamento => orcamento.id === action.payload ? {...orcamento, selecionado: true} : orcamento);
    },
  },
})

export const { selecionar } = ideacaoSlice.actions
export default ideacaoSlice.reducer