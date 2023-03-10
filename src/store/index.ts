import { FileInfo, RouteItem1, FilesMap } from "@/types";
import { defineStore } from "pinia";
import { createAllFilesMap, createTreeFilesMap } from "@/utils/routesHandle";

export interface StoreType {
  // 所有文章文件信息
  allFileList: FileInfo[];
  treeFilesMap: FilesMap;
}

export const useStore = defineStore("appStore", {
  state(): StoreType {
    return {
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
  },
});
