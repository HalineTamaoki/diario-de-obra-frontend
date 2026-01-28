import { type PayloadAction } from '@reduxjs/toolkit';
import type { Ideia } from '../types/Ideia';
import type { DetalhesObraState } from './itemsObraSlice';
import type { IdItemId } from '../types/DetalhesObra';

export const ideacaoReducers = {
  addLink: (state: DetalhesObraState, action: PayloadAction<Omit<Ideia, 'id'>>) => {
    const itemObra = state.itemsObra.find(item => item.id === action.payload.idItem);
    if(itemObra?.ideacao){
      itemObra?.ideacao?.push({...action.payload, id: Math.random()});
    } else {
      itemObra!.ideacao = [{...action.payload, id: Math.random()}];
    }
  },
  removerLink: (state: DetalhesObraState, action: PayloadAction<IdItemId>) => {
    state.itemsObra = state.itemsObra.map(item => 
      item.id === action.payload.idItem ?
        {...item, ideacao: item.ideacao?.filter(ideia => ideia.id !== action.payload.id)} : item);
  },
}
