import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Usuario } from '../types/Usuario';

type Token = {
    access_token: string,
    validTo: string
}

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

export const login = createAsyncThunk<
    Token,
    Usuario,
    { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
    const { email, senha } = credentials

    //TODO: substituir pela chamada da API
    await new Promise((r) => setTimeout(r, 800))
    
    if (senha === '123456' && email) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)

        const token: Token = {
          access_token: 'fake-jwt-token-123',
          validTo: tomorrow.toDateString()
        }
        localStorage.setItem('auth', JSON.stringify(token));
        return token;
    }
    return rejectWithValue('Credenciais inválidas')
});

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
      .addCase(login.pending, (state) => {state.status = 'loading'})
      .addCase(login.fulfilled, (state,  action: PayloadAction<Token>) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer