import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            thresholds: {
                lines: 80,
                functions: 70,
                branches: 70,
                statements: 80,
            },
            include: ['src/**/*.tsx'],
            exclude: [
                'node_modules/**',
                'src/services/**',
                'dist/**',
                '**/[.]**',
                '**/*.d.ts',
                '**/__tests__/**',
            ],
        },
    },
})