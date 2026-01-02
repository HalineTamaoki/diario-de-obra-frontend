import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { EtapasObra, ItemObra } from '../types/DetalhesObra';

type DetalhesObraState = { itemsObra: ItemObra[] }
const initialState: DetalhesObraState = { itemsObra: [] }

const getProximaEtapa = (etapa: EtapasObra) => {
  switch(etapa){
    case 'ideacao':
      return 'orcamento';
    case 'orcamento':
      return 'execucao';
    case 'execucao':
      return 'finalizado';
    default:
      return 'ideacao'
  }
}

const getEtapaAnterior = (etapa: EtapasObra) => {
  switch(etapa){
    case 'orcamento':
      return 'ideacao';
    case 'execucao':
      return 'orcamento';
    case 'execucao':
      return 'ideacao';
    default:
      return 'execucao';
  }
}

const itemsObraSlice = createSlice({
  name: 'itemsObra',
  initialState,
  reducers: {
    addItemObra: (state, action: PayloadAction<{nome: string}>) => {
      state.itemsObra.push({nome: action.payload.nome, ultimaEtapa: 'ideacao', id: Math.random()});
    },
    editarItemObra: (state, action: PayloadAction<{id: number, nome: string}>) => {
      state.itemsObra = state.itemsObra.map(itemObra => itemObra.id === action.payload.id ? {...itemObra, nome: action.payload.nome} : itemObra);
    },
    voltarEtapa: (state, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.map(itemObra => itemObra.id === action.payload ? {...itemObra, ultimaEtapa: getEtapaAnterior(itemObra.ultimaEtapa)} : itemObra);
    },
    avancarEtapa: (state, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.map(itemObra => itemObra.id === action.payload ? {...itemObra, ultimaEtapa: getProximaEtapa(itemObra.ultimaEtapa)} : itemObra);
    },
    removerItemObra: (state, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.filter(itemObra => itemObra.id !== action.payload)
    },
  },
})

export const { addItemObra, editarItemObra, avancarEtapa, voltarEtapa, removerItemObra } = itemsObraSlice.actions
export default itemsObraSlice.reducer