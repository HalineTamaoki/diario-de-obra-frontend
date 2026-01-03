import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NovoOrcamentoType, OrcamentoResumo } from '../types/Orcamento';

type OrcamentoState = { resumoOrcamentos: OrcamentoResumo[] }
const initialState: OrcamentoState = { resumoOrcamentos: [] }

const ideacaoSlice = createSlice({
  name: 'orcamentos',
  initialState,
  reducers: {
    addOrcamento: (state, action: PayloadAction<NovoOrcamentoType>) => {
      state.resumoOrcamentos.push({...action.payload, id: Math.random()});
    }, 
    selecionarOrcamento: (state, action: PayloadAction<number>) => {
      state.resumoOrcamentos = state.resumoOrcamentos.map(orcamento => orcamento.id === action.payload ? {...orcamento, selecionado: true} : {...orcamento, selecionado: false});
    },
    desselecionarOrcamento: (state, action: PayloadAction<number>) => {
      state.resumoOrcamentos = state.resumoOrcamentos.map(orcamento => orcamento.id === action.payload ? {...orcamento, selecionado: false} : orcamento);
    },
    deletarOrcamento: (state, action: PayloadAction<number>) => {
      state.resumoOrcamentos = state.resumoOrcamentos.filter(orcamento => orcamento.id !== action.payload);
    },
  },
})

export const { addOrcamento, selecionarOrcamento, desselecionarOrcamento, deletarOrcamento } = ideacaoSlice.actions
export default ideacaoSlice.reducer