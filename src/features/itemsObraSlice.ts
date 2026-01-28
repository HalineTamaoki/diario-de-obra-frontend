import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { ItemObra } from '../types/DetalhesObra';
import { ideacaoReducers } from './ideacaoReducers';
import { itemsObraReducers } from './itemObraReducers';
import { orcamentoReducer } from './orcamentoReducer';
import { execucaoReducers } from './execucaoReducers';
import { finalizacaoReducers } from './finalizacaoReducers';

export type DetalhesObraState = { itemsObra: ItemObra[] }
const initialState: DetalhesObraState = { itemsObra: [] }

const itemsObraSlice = createSlice({
  name: 'itemsObra',
  initialState,
  reducers: {
    ...itemsObraReducers,
    ...ideacaoReducers,
    ...orcamentoReducer,
    ...execucaoReducers,
    ...finalizacaoReducers
  },
})

export const itemsObraActions = itemsObraSlice.actions
export default itemsObraSlice.reducer

export const selectItemObra = createSelector(
  [
    (state: DetalhesObraState) => state.itemsObra,
    (_: DetalhesObraState, itemObraId: number) => itemObraId
  ],
  (itemsObra, itemObraId) => itemsObra.find(i => i.id === itemObraId) ?? null
);