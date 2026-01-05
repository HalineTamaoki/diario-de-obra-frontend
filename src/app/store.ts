import { configureStore } from '@reduxjs/toolkit'
import obraSlice from '../features/obraSlice'
import itemsObraSlice from '../features/itemsObraSlice'
import ideacaoSlice from '../features/ideacaoSlice'
import orcamentoSlice from '../features/orcamentoSlice'
import detalhesOrcamentoSlice from '../features/detalhesOrcamentoSlice'

export const store = configureStore({
    reducer: {
        obra: obraSlice,
        detalhesObra: itemsObraSlice,
        ideacao: ideacaoSlice,
        orcamento: orcamentoSlice,
        detalhesOrcamento: detalhesOrcamentoSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch