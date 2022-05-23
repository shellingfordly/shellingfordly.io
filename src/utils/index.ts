import { ResultType, FileType } from "@/enum";
import { RouteMap } from "@/types";
import lodash from "lodash";
import { RouteRecordNormalized } from "vue-router";
const { cloneDeep } = lodash;

export function getBaseRouteMap(baseRoute: RouteRecordNormalized[]) {
  const routeMap: RouteMap = {};

  Object.values(baseRoute).forEach((route) => {
    const key = route.name as string;
    const other: any = route.meta.frontmatter;
    if (!key.includes("-")) {
      routeMap[key] = createRouteItem(
        key,
        other.name,
        route.path,
        ResultType.Page,
        "",
        FileType.Page,
        route.meta.frontmatter
      );
    } else {
      handleRouteName(key, route);
    }
  });

  function handleRouteName(
    routeName: string,
    route: RouteRecordNormalized,
    parent: string = ""
  ) {
    const index = routeName.indexOf("-");
    const key =
      index !== -1 ? routeName.slice(0, index).trim() : routeName.trim();
    const childName = index !== -1 ? routeName.slice(index + 1).trim() : "";
    const type = !!childName ? ResultType.Route : ResultType.Page;
    const other: any = route.meta.frontmatter;
    if (!key) return;

    if (routeMap[key]) {
      handleRouteName(childName, route, key);
    } else {
      routeMap[key] = createRouteItem(
        routeName,
        other.name,
        route.path,
        type,
        parent,
        childName ? FileType.Route : FileType.Page,
        route.meta.frontmatter
      );
      if (childName) {
        handleRouteName(childName, route, key);
      }
    }
  }
  return routeMap;
}

function createRouteItem(
  key: string,
  name: string,
  path: string,
  type: ResultType,
  parent: string,
  fileType,
  other: any
) {
  return {
    key,
    name,
    path,
    type,
    parent,
    fileType,
    date: other.date || new Date("2022-05-10"),
    author: other.author || "shellingfordly",
    tag: other.tag || "unknown",
  };
}

export function getRouteMap(baseRoute: RouteRecordNormalized[]) {
  let routeMap: RouteMap = cloneDeep(getBaseRouteMap(baseRoute));
  const allRoutes: RouteMap = {};
  const sortMap: Record<string, number> = {};
  console.log("routeMap", routeMap);

  Object.keys(routeMap)
    .sort()
    .forEach((key, i) => (sortMap[key] = i + 1));

  Object.values(routeMap).forEach((route) => {
    route.index = sortMap[route.key];
    if (!route.parent) {
      route.children = {};
      allRoutes[route.key] = route;
    } else {
      const parent = routeMap[route.parent];

      if (parent.children) {
        parent.children[route.key] = route;
      } else {
        parent.children = {
          [route.key]: route,
        };
      }
    }
  });
  routeMap.index.index = 0;
  routeMap = undefined;

  return allRoutes;
}
