import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/arbutus-web/",
  build: {
    outDir: "dist",
    target: "es2018",
    modulePreload: false,
    emptyOutDir: true,
    sourcemap: false
  }
});