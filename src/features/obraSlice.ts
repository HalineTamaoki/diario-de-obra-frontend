import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Obra } from '../types/Obra'

type ObraState = { obras: Obra[] }
const initialState: ObraState = { obras: [] }

const obraSlice = createSlice({
  name: 'obra',
  initialState,
  reducers: {
    addObra: (state, action: PayloadAction<Omit<Obra, 'id'>>) => {
      state.obras.push({...action.payload, id: Math.random()});
    },
    editarObra: (state, action: PayloadAction<{id: number, nome: string}>) => {
      state.obras = state.obras.map(obra => obra.id === action.payload.id ? {...obra, nome: action.payload.nome} : obra);
    },
    removerObra: (state, action: PayloadAction<number>) => {
      state.obras = state.obras.filter(obra => obra.id !== action.payload)
    },
  },
})

export const { addObra, editarObra, removerObra } = obraSlice.actions
export default obraSlice.reducer