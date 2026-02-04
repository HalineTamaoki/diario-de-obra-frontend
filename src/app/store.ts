import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/authSlice'
import notificacaoSlice from '../features/notificacaoSlice'
import itemsObraSlice from '../features/itemsObraSlice'
import obraSlice from '../features/obraSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        notificacao: notificacaoSlice,
        obra: obraSlice,
        detalhesObra: itemsObraSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch