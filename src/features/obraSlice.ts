import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { obraApi } from '../services/obraApi'
import type { NomeId } from '../types/Common'
import type { Obra } from '../types/Obra'

type ObraState = { obras: Obra[] }
const initialState: ObraState = { obras: [] }

const obraSlice = createSlice({
  name: 'obra',
  initialState,
  reducers: {
    removerObra: (state, action: PayloadAction<number>) => {
      state.obras = state.obras.filter(obra => obra.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        obraApi.endpoints.cadastrarObra.matchFulfilled,
        (state, action: PayloadAction<NomeId>) => {
          state.obras.push({...action.payload, porcentagem: 0});
        }
      )
      .addMatcher(
        obraApi.endpoints.obterObras.matchFulfilled,
        (state, action: PayloadAction<Obra[]>) => {
          state.obras = action.payload;
        }
      )
      .addMatcher(
        obraApi.endpoints.editarObra.matchFulfilled,
        (state, action: PayloadAction<NomeId>) => {
          state.obras = state.obras.map(obra => obra.id === action.payload.id ? {...obra, nome: action.payload.nome} : obra);
        }
      )
  }
})

export const { removerObra } = obraSlice.actions
export default obraSlice.reducer;