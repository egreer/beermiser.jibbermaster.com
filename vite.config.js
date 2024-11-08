import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default ({ mode }) => {
  return defineConfig({
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    build: {
      outDir: "build",
    },
    plugins: [
      react(),
      VitePWA({
        injectRegister: "auto",
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
        manifest: false,
      }),
    ],
    server: {
      port: 3000,
    },
  });
};
