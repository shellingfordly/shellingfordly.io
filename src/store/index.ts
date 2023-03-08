import { getBaseRouteMap, getRouteMap } from "@/utils";
import { RouteMap, FileInfo, RouteItem1 } from "@/types";
import { defineStore } from "pinia";
import { RouteRecordNormalized } from "vue-router";
import { createAllFilesMap } from "@/utils/routesHandle";

export interface StoreType {
  routeMap: RouteMap;
  allRoutes: RouteMap;
  allFileList: FileInfo[];
}

export const useStore = defineStore("appStore", {
  state(): StoreType {
    return {
      routeMap: {},
      allRoutes: {},
      allFileList: [],
    };
  },
  actions: {
    initFilesMap(routes: RouteItem1[]) {
      // 过滤不需要的路由
      const _routes = routes.filter(
        (r) =>
          !r.path.includes(".html") &&
          !String(r.name).includes("all") &&
          r.path !== "/"
      );

      this.allFileList = createAllFilesMap(_routes);
      console.log(this.allFileList)
    },
    setRouteMap(baseRoutes: RouteRecordNormalized[]) {
      const _baseRoutes = baseRoutes.filter((v) => {
        return (
          !v.path.includes(".html") &&
          !String(v.name).includes("all") &&
          v.path !== "/"
        );
      });

      this.routeMap = getRouteMap(_baseRoutes);
      this.allRoutes = getBaseRouteMap(_baseRoutes);
    },
  },
});
