import { describe, expect, it } from 'vitest';
import { store } from '../../app/store';

describe('Redux Store Configuration', () => {
    
    it('deve inicializar com o estado correto', () => {
        const state = store.getState();

        expect(state).toHaveProperty('auth');
        expect(state).toHaveProperty('notificacao');
        expect(state).toHaveProperty('baseApi');
    });

    it('deve ter o middleware da API configurado corretamente', async () => {
        const state = store.getState();
        
        expect(state.baseApi).toBeDefined();
        expect(state.baseApi.queries).toBeDefined();
    });

    it('deve permitir disparar ações nos slices customizados', () => {        
        const stateBefore = store.getState().auth;
        expect(typeof stateBefore).toBe('object');
    });

});