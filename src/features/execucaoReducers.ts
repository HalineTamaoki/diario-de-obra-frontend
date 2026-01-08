import { type PayloadAction } from '@reduxjs/toolkit';
import type { OutraData, Previsao } from '../types/Execucao';
import type { DetalhesObraState } from './itemsObraSlice';
import type { IdObraId } from '../types/DetalhesObra';

type IdObra = { idObra: number };
type AddOutraDataPayload = Omit<OutraData, 'id'> & IdObra;
type EditarOutraDataPayload = Omit<OutraData, 'nome'> & IdObra;
type EditarPrevisaoPayload = Previsao & IdObra;

export const execucaoReducers = {
    addOutraData: (state: DetalhesObraState, action: PayloadAction<AddOutraDataPayload>) => {
      state.itemsObra = state.itemsObra.map(item => {
        if(item.id === action.payload.idObra){
          if(item.execucao?.outrasDatas){
            item.execucao.outrasDatas.push({...action.payload, id: Math.random()});
          } else if (item.execucao) {
            item.execucao.outrasDatas = [{...action.payload, id: Math.random()}];
          } else {
            item.execucao = { idObra: action.payload.idObra, outrasDatas: [{...action.payload, id: Math.random()}] };
          }
        }
        return item;
      });
    },
    removerOutraData: (state: DetalhesObraState, action: PayloadAction<IdObraId>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idObra ?
          {...item, execucao: item.execucao?.outrasDatas ? {...item.execucao, outrasDatas: item.execucao.outrasDatas.filter(outraData => outraData.id !== action.payload.id)} : item.execucao} : item);
    },
    editarOutraData: (state: DetalhesObraState, action: PayloadAction<EditarOutraDataPayload>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idObra ?
          {...item, 
            execucao: item.execucao?.outrasDatas ? 
              {...item.execucao, 
                outrasDatas: item.execucao.outrasDatas.map(outraData => outraData.id === action.payload.id ? {...outraData, data: action.payload.data} : outraData)
              } : item.execucao} : item);
    },
    editarPrevisao: (state: DetalhesObraState, action: PayloadAction<EditarPrevisaoPayload>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idObra ?
          {...item, 
            execucao: item.execucao ? {
              ...item.execucao, 
              previsao: action.payload
            } : {
              idObra: action.payload.idObra,
              previsao: action.payload
            }
          } : item);
    },
    editarComentarioExecucao: (state: DetalhesObraState, action: PayloadAction<{comentario: string, idObra: number}>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload.idObra ?
          {
            ...item, 
            execucao: item.execucao ? {...item.execucao, comentarios: action.payload.comentario} : {idObra: action.payload.idObra, comentarios: action.payload.comentario}
          } : item);
    },
    marcarFinalizado: (state: DetalhesObraState, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.map(item => 
        item.id === action.payload ?
          {
            ...item, 
            execucao: item.execucao ? {...item.execucao, finalizado: true} : {idObra: action.payload, finalizado: true}
          } : item);
    },
  }