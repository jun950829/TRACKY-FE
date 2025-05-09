import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: "dist",
  },
  ssr: {
    noExternal: ["@vercel/node"]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      path: "path-browserify",
      url: "url",
    },
  },
  server: {
    proxy: {
      "/hub": {
        target: "http://tracky-hub-514597513.ap-northeast-2.elb.amazonaws.com:80", // ELB 주소
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hub/, ""),
      },
      "/api": {
        target: "http://localhost:8080/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/events": {
        target: "http://localhost:8080/events",
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: (path) => path.replace(/^\/events/, "/events"),
      },
    },
    port: 5173,
    strictPort: true

    // proxy: {
    //   "/api": {
    //     target: "http://tracky-hub-2020422079.ap-northeast-2.elb.amazonaws.com:8082", // Spring 서버 주소
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
    
  },
});
