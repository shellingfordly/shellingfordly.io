import { getBaseRouteMap, getRouteMap } from "@/utils";
import { RouteItem, RouteMap } from "@/types";
import { defineStore } from "pinia";
import { RouteRecordNormalized } from "vue-router";

export interface StoreType {
  routeMap: RouteMap;
  allRoutes: RouteItem[];
  setRouteMap: () => void;
}

export const useStore = defineStore("appStore", {
  state() {
    return {
      routeMap: {},
      allRoutes: [],
    };
  },
  actions: {
    setRouteMap(baseRoutes: RouteRecordNormalized[]) {
      const _baseRoutes = baseRoutes.filter((v) => !v.path.includes(".html"));
      this.routeMap = getRouteMap(_baseRoutes);
      this.allRoutes = getBaseRouteMap(_baseRoutes);
    },
  },
});
