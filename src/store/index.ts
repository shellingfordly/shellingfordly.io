import { getRouteMap } from "@/utils";
import { RouteMap } from "@/types";
import { defineStore } from "pinia";
import { RouteRecordNormalized } from "vue-router";

export interface StoreType {
  routeMap: RouteMap;
  setRouteMap: () => void;
}

export const useStore = defineStore("appStore", {
  state() {
    return {
      routeMap: {},
    };
  },
  actions: {
    setRouteMap(baseRoutes: RouteRecordNormalized[]) {
      this.routeMap = getRouteMap(
        baseRoutes.filter((v) => !v.path.includes(".html"))
      );
    },
  },
});
