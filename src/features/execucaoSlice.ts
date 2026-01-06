import { createSlice } from '@reduxjs/toolkit';
import type { Execucao } from '../types/Exeucacao';

type ExecucaoState = { execucao?: Execucao }
const initialState: ExecucaoState = { execucao: undefined }

const execucaoSlice = createSlice({
  name: 'execucao',
  initialState,
  reducers: {
    // addLink: (state, action: PayloadAction<Omit<Ideia, 'id'>>) => {
    //   state.execucao.push({...action.payload, id: Math.random()});
    // },
    // removerLink: (state, action: PayloadAction<number>) => {
    //   state.execucao = state.execucao.filter(ideia => ideia.id !== action.payload)
    // },
  },
})

export const {  } = execucaoSlice.actions
export default execucaoSlice.reducer