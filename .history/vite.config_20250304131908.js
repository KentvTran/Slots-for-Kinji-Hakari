import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx", // Ensures JSX is processed correctly
    include: [/src\/.*\.jsx?/], /
  }
});

