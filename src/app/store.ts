import { configureStore } from '@reduxjs/toolkit'
import itemsObraSlice from '../features/itemsObraSlice'
import obraSlice from '../features/obraSlice'

export const store = configureStore({
    reducer: {
        obra: obraSlice,
        detalhesObra: itemsObraSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch