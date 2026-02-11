import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { ItemObra } from '../types/DetalhesObra';
import { orcamentoReducer } from './orcamentoReducer';

export type DetalhesObraState = { itemsObra: ItemObra[] }
const initialState: DetalhesObraState = { itemsObra: [] }

const itemsObraSlice = createSlice({
  name: 'itemsObra',
  initialState,
  reducers: {
    ...orcamentoReducer,
  },    
})

export const itemsObraActions = itemsObraSlice.actions
export default itemsObraSlice.reducer

export const selectItemObra = createSelector(
  [
    (state: DetalhesObraState) => state.itemsObra,
    (_: DetalhesObraState, itemidObra: number) => itemidObra
  ],
  (itemsObra, itemidObra) => itemsObra.find(i => i.id === itemidObra) ?? null
);