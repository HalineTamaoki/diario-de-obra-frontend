import { configureStore } from '@reduxjs/toolkit'
import obraSlice from '../features/obraSlice'
import itemsObraSlice from '../features/itemsObraSlice'

export const store = configureStore({
    reducer: {
        obra: obraSlice,
        detalhesObra: itemsObraSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch