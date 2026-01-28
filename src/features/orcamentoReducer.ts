import { type PayloadAction } from '@reduxjs/toolkit';
import type { NovoOrcamentoType } from '../types/Orcamento';
import type { DetalhesObraState } from './itemsObraSlice';
import type { IdItemId } from '../types/DetalhesObra';

export const orcamentoReducer = {
    addOrcamento: (state: DetalhesObraState, action: PayloadAction<NovoOrcamentoType>) => {
      state.itemsObra = state.itemsObra.map(item => {
        if(item.id === action.payload.idItem) {
          if(item?.orcamento){
            item.orcamento.push({...action.payload, id: Math.random()});
          } else {
            return {...item, orcamento: [{...action.payload, id: Math.random()}]};
          };
        } 
        return item;
      });
    }, 
    selecionarOrcamento: (state: DetalhesObraState, action: PayloadAction<IdItemId>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {...item, 
            orcamento: item.orcamento?.map(orcamento => orcamento.id === action.payload.id ? {...orcamento, selecionado: true} : {...orcamento, selecionado: false})
          } : item);
    },
    desselecionarOrcamento: (state: DetalhesObraState, action: PayloadAction<IdItemId>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {...item, 
            orcamento: item.orcamento?.map(orcamento => orcamento.id === action.payload.id ? {...orcamento, selecionado: false} : orcamento)
          } : item);
    },
    deletarOrcamento: (state: DetalhesObraState, action: PayloadAction<IdItemId>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {...item, 
            orcamento: item.orcamento?.filter(orcamento => orcamento.id !== action.payload.id)
          } : item);
    },
  }