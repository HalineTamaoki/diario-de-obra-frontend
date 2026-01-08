import { type PayloadAction } from '@reduxjs/toolkit';
import type { OutraData, Previsao } from '../types/Execucao';
import type { DetalhesObraState } from './itemsObraSlice';
import type { IdItemId } from '../types/DetalhesObra';

type IdObra = { idItem: number };
type AddOutraDataPayload = Omit<OutraData, 'id'> & IdObra;
type EditarOutraDataPayload = Omit<OutraData, 'nome'> & IdObra;
type EditarPrevisaoPayload = Previsao & IdObra;

export const execucaoReducers = {
    addOutraData: (state: DetalhesObraState, action: PayloadAction<AddOutraDataPayload>) => {
      state.itemsObra = state.itemsObra.map(item => {
        if(item.id === action.payload.idItem){
          if(item.execucao?.outrasDatas){
            item.execucao.outrasDatas.push({...action.payload, id: Math.random()});
          } else if (item.execucao) {
            item.execucao.outrasDatas = [{...action.payload, id: Math.random()}];
          } else {
            item.execucao = { idItem: action.payload.idItem, outrasDatas: [{...action.payload, id: Math.random()}] };
          }
        }
        return item;
      });
    },
    removerOutraData: (state: DetalhesObraState, action: PayloadAction<IdItemId>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {...item, execucao: item.execucao?.outrasDatas ? {...item.execucao, outrasDatas: item.execucao.outrasDatas.filter(outraData => outraData.id !== action.payload.id)} : item.execucao} : item);
    },
    editarOutraData: (state: DetalhesObraState, action: PayloadAction<EditarOutraDataPayload>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {...item, 
            execucao: item.execucao?.outrasDatas ? 
              {...item.execucao, 
                outrasDatas: item.execucao.outrasDatas.map(outraData => outraData.id === action.payload.id ? {...outraData, data: action.payload.data} : outraData)
              } : item.execucao} : item);
    },
    editarPrevisao: (state: DetalhesObraState, action: PayloadAction<EditarPrevisaoPayload>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {...item, 
            execucao: item.execucao ? {
              ...item.execucao, 
              previsao: action.payload
            } : {
              idItem: action.payload.idItem,
              previsao: action.payload
            }
          } : item);
    },
    editarComentarioExecucao: (state: DetalhesObraState, action: PayloadAction<{comentario: string, idItem: number}>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idItem ?
          {
            ...item, 
            execucao: item.execucao ? {...item.execucao, comentarios: action.payload.comentario} : {idItem: action.payload.idItem, comentarios: action.payload.comentario}
          } : item);
    },
    marcarFinalizado: (state: DetalhesObraState, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload ?
          {
            ...item, 
            execucao: item.execucao ? {...item.execucao, finalizado: true} : {idItem: action.payload, finalizado: true}
          } : item);
    },
  }