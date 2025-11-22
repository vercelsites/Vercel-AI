import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo atual
  // O terceiro parâmetro '' permite carregar todas as variáveis, não apenas VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Mapeia a variável de ambiente do sistema (Vercel) para o código React
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    }
  };
});