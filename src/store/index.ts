import { getBaseRouteMap, getRouteMap } from "@/utils";
import { RouteMap } from "@/types";
import { defineStore } from "pinia";
import { RouteRecordNormalized } from "vue-router";

export interface StoreType {
  routeMap: RouteMap;
  allRoutes: RouteMap;
}

export const useStore = defineStore("appStore", {
  state(): StoreType {
    return {
      routeMap: {},
      allRoutes: {},
    };
  },
  actions: {
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
