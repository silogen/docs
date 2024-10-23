import react from "@vitejs/plugin-react";

import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    setupFiles: ["./vitest.setup.ts"],
    mockReset: true,
    globals: true,
    environment: "jsdom",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress}.config.*",
    ],
    env: {
      NEXTAUTH_SECRET: "test-secret-key",
      KEYCLOAK_ID: "some-id",
      KEYCLOAK_SECRET: "some-id",
      KEYCLOAK_ISSUER: "some-id",
      NODE_ENV: "test",
    },
  },
});
