import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/pages/MeusServicosContratados/MeusServicosContratados.tsx',
        'src/pages/MeusServicosContratados/components/ServicoContratadoPrestadorCard.tsx',
        'src/pages/AtualizarStatusServico/AtualizarStatusServico.tsx',
        'src/services/servico-contratado.service.ts',
      ],
      thresholds: {
        statements: 70,
        branches: 80,
        functions: 70,
        lines: 70,
      },
    },
  },
});
