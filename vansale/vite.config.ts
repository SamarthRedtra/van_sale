import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import proxyOptions from "./proxyOptions";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugin: Partial<VitePWAOptions> = {
  strategies: "injectManifest",
  registerType: 'autoUpdate',
    injectRegister: null,
    outDir: "../van_sale/public/vansale",
  injectManifest: {
    swSrc: "src/sw.js", // Path to your custom service worker
  },
  manifest: {
    name: "Vansale",
    start_url:"/vansale",
    short_name: "Vansale",
    description: "A sales and delivery app",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  server: {
    port: 8080,
    proxy: proxyOptions,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../van_sale/public/vansale",
    emptyOutDir: true,
    target: "es2015",
  },
});
