import { getBaseRouteMap, getRouteMap } from "@/utils";
import { RouteMap, FileInfo, RouteItem1, FilesMap } from "@/types";
import { defineStore } from "pinia";
import { RouteRecordNormalized } from "vue-router";
import { createAllFilesMap, createTreeFilesMap } from "@/utils/routesHandle";

export interface StoreType {
  routeMap: RouteMap;
  allRoutes: RouteMap;
  // 所有文章文件信息
  allFileList: FileInfo[];
  treeFilesMap: FilesMap;
}

export const useStore = defineStore("appStore", {
  state(): StoreType {
    return {
      routeMap: {},
      allRoutes: {},
      allFileList: [],
      treeFilesMap: {},
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

      // 创建 所有文章 文件信息
      this.allFileList = createAllFilesMap(_routes);
      // 创建 树结构的 文件结构
      this.treeFilesMap = createTreeFilesMap(_routes);
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
