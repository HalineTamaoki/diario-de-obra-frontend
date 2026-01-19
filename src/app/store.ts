import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/authSlice'
import notificacaoSlice from '../features/notificacaoSlice'
import obraSlice from '../features/obraSlice'
import itemsObraSlice from '../features/itemsObraSlice'
import ideacaoSlice from '../features/ideacaoSlice'
import orcamentoSlice from '../features/orcamentoSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        notificacao: notificacaoSlice,
        obra: obraSlice,
        detalhesObra: itemsObraSlice,
        ideacao: ideacaoSlice,
        orcamento: orcamentoSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch