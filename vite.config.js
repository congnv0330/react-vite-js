import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
// import bundleAnalyzer from 'rollup-plugin-bundle-analyzer';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const _env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      // bundleAnalyzer({
      //   analyzerMode: 'server',
      // }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': _env.VITE_API_URL,
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: '[hash].chunk.js',
          assetFileNames: '[hash].chunk.[ext]',
        },
      },
    },
  };
});
