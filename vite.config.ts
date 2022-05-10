import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  server: {
    port: 4000,
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            "src/styles/index.less"
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router", "vue-i18n", "vue/macros"],
      dts: "src/auto-imports.d.ts",
    }),
  ],
});
