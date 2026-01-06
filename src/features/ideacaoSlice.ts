import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Ideia } from '../types/Ideia';

type IdeacaoState = { ideias: Ideia[] }
const initialState: IdeacaoState = { ideias: [
  {id: 1, link: 'https://www.instagram.com/p/DTH6UB8Dcjg/?igsh=MXIxOXZkZDdvMDZzdg='}
] }

const ideacaoSlice = createSlice({
  name: 'ideias',
  initialState,
  reducers: {
    addLink: (state, action: PayloadAction<Omit<Ideia, 'id'>>) => {
      state.ideias.push({...action.payload, id: Math.random()});
    },
    removerLink: (state, action: PayloadAction<number>) => {
      state.ideias = state.ideias.filter(ideia => ideia.id !== action.payload)
    },
  },
})

export const { addLink, removerLink } = ideacaoSlice.actions
export default ideacaoSlice.reducer