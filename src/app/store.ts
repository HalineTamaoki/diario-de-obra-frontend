import { configureStore } from '@reduxjs/toolkit'
import obraSlice from '../features/obraSlice'


export const store = configureStore({
    reducer: {
        obra: obraSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch