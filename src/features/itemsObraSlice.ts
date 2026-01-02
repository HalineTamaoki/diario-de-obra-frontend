import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ItemObra } from '../types/DetalhesObra';

type DetalhesObraState = { itemsObra: ItemObra[] }
const initialState: DetalhesObraState = { itemsObra: [] }

const itemsObraSlice = createSlice({
  name: 'itemsObra',
  initialState,
  reducers: {
    addItemObra: (state) => {
      state.itemsObra.push({nome: 'Novo item', ultimaEtapa: 'ideacao', id: Math.random()});
    },
    editarItemObra: (state, action: PayloadAction<{id: number, nome: string}>) => {
      state.itemsObra = state.itemsObra.map(itemObra => itemObra.id === action.payload.id ? {...itemObra, nome: action.payload.nome} : itemObra);
    },
    removerItemObra: (state, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.filter(itemObra => itemObra.id !== action.payload)
    },
  },
})

export const { addItemObra, editarItemObra, removerItemObra } = itemsObraSlice.actions
export default itemsObraSlice.reducer