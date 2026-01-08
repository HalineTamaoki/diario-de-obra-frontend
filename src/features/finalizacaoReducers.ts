import { type PayloadAction } from '@reduxjs/toolkit';
import type { DetalhesObraState } from './itemsObraSlice';

export const finalizacaoReducers = {
    editarDataFinalizacao: (state: DetalhesObraState, action: PayloadAction<{data: string | undefined, idItem: number}>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {
            ...item, 
            finalizacao: item.finalizacao ? {...item.finalizacao, data: action.payload.data} : action.payload} : item);
    },
    editarComentarioFinalizacao: (state: DetalhesObraState, action: PayloadAction<{comentarios: string, idItem: number}>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {
            ...item, 
            finalizacao: item.finalizacao ? {...item.finalizacao, comentarios: action.payload.comentarios} : action.payload} : item);
    }
}