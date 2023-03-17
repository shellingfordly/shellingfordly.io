import App from "./App.vue";
import "./styles/index.less";
import autoRoutes from "pages-generated";
import { ViteSSG } from "vite-ssg";
import NProgress from "nprogress";
import { createPinia } from "pinia";

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
  ({ app, router, isClient }) => {
    app.use(createPinia());
    if (isClient) {
      router.beforeEach(() => {
        NProgress.start();
      });
      router.afterEach((to) => {
        if (to.path !== "/") {
          document.body.scrollTo(0, 0);
        }
        NProgress.done();
      });
    }
  }
);
