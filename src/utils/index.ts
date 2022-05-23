import { ResultType, FileType } from "@/enum";
import { RouteMap } from "@/types";
import lodash from "lodash";
import { RouteRecordNormalized } from "vue-router";
const { cloneDeep } = lodash;

export function getBaseRouteMap(baseRoute: RouteRecordNormalized[]) {
  const routeMap: RouteMap = {};

  Object.values(baseRoute).forEach((route) => {
    const name = route.name as string;
    if (!name.includes("-")) {
      routeMap[name] = createRouteItem(
        name,
        route.path,
        ResultType.Page,
        "",
        FileType.Page,
        route.meta.frontmatter
      );
    } else {
      handleRouteName(name, route);
    }
  });

  function handleRouteName(
    nameStr: string,
    route: RouteRecordNormalized,
    parent: string = ""
  ) {
    const index = nameStr.indexOf("-");
    const name = index !== -1 ? nameStr.slice(0, index).trim() : nameStr.trim();
    const childName = index !== -1 ? nameStr.slice(index + 1).trim() : "";
    const type = !!childName ? ResultType.Route : ResultType.Page;
    if (!name) return;

    if (routeMap[name]) {
      handleRouteName(childName, route, name);
    } else {
      routeMap[name] = createRouteItem(
        name,
        route.path,
        type,
        parent,
        childName ? FileType.Route : FileType.Page,
        route.meta.frontmatter
      );
      if (childName) {
        handleRouteName(childName, route, name);
      }
    }
  }

  return routeMap;
}

function createRouteItem(
  name: string,
  path: string,
  type: ResultType,
  parent: string,
  fileType,
  other: any
) {
  return {
    name,
    path,
    type,
    parent,
    title: other.title || "",
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

  Object.keys(routeMap)
    .sort()
    .forEach((key, i) => (sortMap[key] = i + 1));

  Object.values(routeMap).forEach((route) => {
    route.index = sortMap[route.name];
    if (!route.parent) {
      route.children = {};
      allRoutes[route.name] = route;
    } else {
      const parent = routeMap[route.parent];

      if (parent.children) {
        parent.children[route.name] = route;
      } else {
        parent.children = {
          [route.name]: route,
        };
      }
    }
  });
  routeMap.index.name = "首页";
  routeMap.index.index = 0;
  routeMap = undefined;

  // route.

  return allRoutes;
}
