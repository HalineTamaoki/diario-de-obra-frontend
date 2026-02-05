import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import type { Token } from '../types/Usuario';

type AuthState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  token: Token | null
}

const parseToken = () => {
    const rawToken = localStorage.getItem('auth');
    if(!rawToken) return null;

    try {
      const parsed = JSON.parse(rawToken);
      return parsed as Token;
    } catch {
      return null;
    }
}

const initialState: AuthState = {
  token: parseToken(),
  status: 'idle'
}

const authSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: (state) => {    
        state.token = null;
        state.status = 'idle';

        localStorage.removeItem('auth')
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<Token>) => {
          state.token = action.payload;
          localStorage.setItem('auth', JSON.stringify(action.payload));
        }
      )
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer