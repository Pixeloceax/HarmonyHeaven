/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  preview: {
    port: 5200,
    strictPort: true,
  },
  server: {
    port: 5200,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:5200",
  },
});
