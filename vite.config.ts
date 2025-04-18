
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./FrontEnd"),
      "@frontend": path.resolve(__dirname, "./FrontEnd"),
      "@backend": path.resolve(__dirname, "./BackEnd"),
      "@database": path.resolve(__dirname, "./Database"),
    },
  },
  root: './',
  publicDir: './FrontEnd/public',
  build: {
    outDir: './dist',
  }
}));
