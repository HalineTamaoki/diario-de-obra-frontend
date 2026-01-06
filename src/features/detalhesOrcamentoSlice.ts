import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrcamentoDetalhesType } from '../types/Orcamento';

type OrcamentoState = { orcamento?: OrcamentoDetalhesType }
const initialState: OrcamentoState = { orcamento: {
  empresa: 'Test',
  data: new Date().toISOString().split('T')[0],
  idObra: 1,
  id: 1
} }

const detalhesOrcamentoSlice = createSlice({
  name: 'detalhesOrcamento',
  initialState,
  reducers: {
    editarDetalhesOrcamento: (state, action: PayloadAction<Partial<OrcamentoDetalhesType>>) => {
        let orcamento = state.orcamento ?? {} as OrcamentoDetalhesType;
        Object.entries(action.payload).forEach(([key, value]) => {
          (orcamento as any)[key as keyof OrcamentoDetalhesType] = value;
        });
        state.orcamento = orcamento;
    }, 
  },
})

export const { editarDetalhesOrcamento } = detalhesOrcamentoSlice.actions
export default detalhesOrcamentoSlice.reducer