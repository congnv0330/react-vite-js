import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { SondaRollupPlugin } from 'sonda';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

  const isAnalyze = command === 'build' && process.env.ANALYZE === 'true';

  if (isAnalyze) {
    plugins.push(
      SondaRollupPlugin({
        open: true,
        filename: 'stats.html',
        detailed: true,
        gzip: true,
      }),
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: isAnalyze,
      assetsDir: 'static',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/[hash].chunk.js',
          assetFileNames: 'static/[hash].[ext]',
        },
      },
    },
  };
});
