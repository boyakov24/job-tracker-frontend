import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/auth": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        "/jobs": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        "/notes": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        "/reminders": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
