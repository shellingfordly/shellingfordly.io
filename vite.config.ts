import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Pages from "vite-plugin-pages";
import fs from "fs";
import Markdown from "vite-plugin-md";
import matter from "gray-matter";
import Prism from "markdown-it-prism";
import anchor from "markdown-it-anchor";
import { slugify } from "./sctipts/slugify";
import TOC from "markdown-it-table-of-contents";
import LinkAttributes from "markdown-it-link-attributes";

import "prismjs/components/prism-regex";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-xml-doc";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javadoclike";
import "prismjs/components/prism-javadoc";
import "prismjs/components/prism-jsdoc";

export default defineConfig({
  server: {
    port: 4000,
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
        md.use(Prism);
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
  ],
});
