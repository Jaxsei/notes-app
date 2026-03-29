import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      strategies: "injectManifest", // use your own SW instead of generateSW
      srcDir: "src",
      filename: "sw.js",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      //testting
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        name: "Nuxtake",
        short_name: "NX",
        description: "Jaxsei's slop",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "masked-icon.svg",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    minify: "esbuild", // esbuild only, no terser
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-radix": [
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-label",
            "@radix-ui/react-slot",
            "@radix-ui/react-separator",
            "@radix-ui/react-navigation-menu",
          ],
          "vendor-editor": ["react-quill", "highlight.js"],
          "vendor-utils": [
            "axios",
            "zustand",
            "date-fns",
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
          ],
        },
      },
    },
  },
});

