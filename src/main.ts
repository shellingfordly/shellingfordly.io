// import { createApp } from "vue";
import App from "./App.vue";
import "./styles/index.less";
import autoRoutes from "pages-generated";
import { ViteSSG } from "vite-ssg";
import NProgress from "nprogress";
import {} from "pinia";

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith("/") ? `${i.path}index.html` : `${i.path}.html`,
  };
});

const scrollBehavior = (to: any, from: any, savedPosition: any) => {
  if (savedPosition) return savedPosition;
  else return { top: 0 };
};

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ router, isClient }) => {
    if (isClient) {
      router.beforeEach(() => {
        NProgress.start();
      });
      router.afterEach(() => {
        NProgress.done();
      });
    }
  }
);
