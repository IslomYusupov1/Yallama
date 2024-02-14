import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {

    alias: {

      "@": path.resolve("./src/"),

      // routes: `${path.resolve(__dirname, "./src/routes/")}`,

      // services: `${path.resolve(__dirname, "./src/services/")}`,

    }

  }
})
