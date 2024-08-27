import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { createFilter, defineConfig } from 'vite';

function removeUseClient() {
  const filter = createFilter(/.*\.(js|ts|jsx|tsx|mjs|cjs)$/);

  return {
    name: 'remove-use-client',

    transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const newCode = code.replace(/['"]use client['"];?\s/g, '');

      return { code: newCode, map: null };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react()];

  const isAnalyze = command === 'build' && process.env.ANALYZE === 'true';

  if (isAnalyze) {
    plugins.push(
      removeUseClient(),
      visualizer({
        open: true,
        filename: 'stats.html',
        sourcemap: true,
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
