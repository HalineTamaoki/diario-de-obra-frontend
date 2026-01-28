import type { PayloadAction } from "@reduxjs/toolkit";
import type { EtapasObra } from "../types/DetalhesObra";
import type { DetalhesObraState } from "./itemsObraSlice";

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

export const itemsObraReducers = {
    addItemObra: (state: DetalhesObraState, action: PayloadAction<{nome: string}>) => {
      state.itemsObra.push({nome: action.payload.nome, ultimaEtapa: 'ideacao', id: Math.random()});
    },
    editarItemObra: (state: DetalhesObraState, action: PayloadAction<{id: number, nome: string}>) => {
      state.itemsObra = state.itemsObra.map(itemObra => itemObra.id === action.payload.id ? {...itemObra, nome: action.payload.nome} : itemObra);
    },
    voltarEtapa: (state: DetalhesObraState, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.map(itemObra => itemObra.id === action.payload ? {...itemObra, ultimaEtapa: getEtapaAnterior(itemObra.ultimaEtapa)} : itemObra);
    },
    avancarEtapa: (state: DetalhesObraState, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.map(itemObra => itemObra.id === action.payload ? {...itemObra, ultimaEtapa: getProximaEtapa(itemObra.ultimaEtapa)} : itemObra);
    },
    removerItemObra: (state: DetalhesObraState, action: PayloadAction<number>) => {
      state.itemsObra = state.itemsObra.filter(itemObra => itemObra.id !== action.payload)
    }, 
}