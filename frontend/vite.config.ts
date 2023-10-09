/// <reference types="vitest" />
/// <reference types="vite/client" />

import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import express from "./express-plugin";

const plugins = [react()];
if ((process.env.MODE || "") != "test") {
  plugins.push(express("../backend/src/server"));
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env.HOST": `'${env.HOST || ""}'`,
      "process.env.PORT": `'${env.PORT || ""}'`,
    },
    plugins,
    server: { port: Number(process.env.PORT) || 8080 },
    test: {
      globals: true,
      environment: "jsdom",
      css: true,
      setupFiles: "./src/test/setup.ts",
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@testing-library/jest-dom": "./node_modules/@testing-library/jest-dom",
      },
      extensions: [".js", ".ts", ".json", ".tsx"],
    },
  };
});
