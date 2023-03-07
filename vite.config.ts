import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Inspect from "vite-plugin-inspect";
import Pages from "vite-plugin-pages";
import fs from "fs";
import Markdown from "vite-plugin-md";
import matter from "gray-matter";
import anchor from "markdown-it-anchor";
import { slugify } from "./scripts/slugify";
import Shiki from 'markdown-it-shiki'
// @ts-expect-error missing types
import TOC from "markdown-it-table-of-contents";
import LinkAttributes from "markdown-it-link-attributes";
import Components from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";

export default defineConfig({
  server: {
    port: 4000,
  },
  resolve: {
    alias: [{ find: "@/", replacement: `${resolve(__dirname, "src")}/` }],
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            "src/styles/var.less"
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Pages({
      extensions: ["vue", "md"],
      pagesDir: "pages",
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1));

        if (!path.includes("projects.md")) {
          const md = fs.readFileSync(path, "utf-8");
          const { data } = matter(md);
          route.meta = Object.assign(route.meta || {}, { frontmatter: data });
        }

        return route;
      },
    }),

    Markdown({
      wrapperComponent: "post",
      wrapperClasses: "prose m-auto",
      headEnabled: true,
      markdownItOptions: {
        quotes: "\"\"''",
      },
      markdownItSetup(md) {
        md.use(Shiki, {
          theme: {
            light: 'vitesse-light',
            dark: 'vitesse-dark',
          },
        })
        
        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: "#",
            renderAttrs: () => ({ "aria-hidden": "true" }),
          }),
        });

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        });

        md.use(TOC, {
          includeLevel: [1, 2, 3],
          slugify,
        });
      },
    }),

    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "vue/macros",
        "@vueuse/core",
        "@vueuse/head",
      ],
      dts: "src/auto-imports.d.ts",
    }),

    Components({
      extensions: ["vue", "md"],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: "",
        }),
      ],
    }),

    Inspect(),
  ],
});
