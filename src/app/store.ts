import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/authSlice'
import itemsObraSlice from '../features/itemsObraSlice'
import notificacaoSlice from '../features/notificacaoSlice'
import { baseApi } from '../services/api'

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authSlice,
        notificacao: notificacaoSlice,
        detalhesObra: itemsObraSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch