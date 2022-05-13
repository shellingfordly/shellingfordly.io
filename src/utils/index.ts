import { ResultType, PermissionType } from "@/enum";
import { RouteMap } from "@/types";
import { cloneDeep } from "lodash";
import { RouteRecordNormalized } from "vue-router";

export function getBaseRouteMap(baseRoute: RouteRecordNormalized[]) {
  const routeMap: RouteMap = {};
  Object.values(baseRoute).forEach((route) => {
    const name = route.name as string;
    if (!name.includes("-")) {
      routeMap[name] = createRouteItem(
        name,
        route.path,
        ResultType.Route,
        "",
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
    const name = index !== -1 ? nameStr.slice(0, index) : nameStr;
    const childName = index !== -1 ? nameStr.slice(index + 1) : "";
    const type = childName ? ResultType.Route : ResultType.Page;

    if (routeMap[name]) {
      handleRouteName(childName, route, name);
    } else {
      routeMap[name] = createRouteItem(
        name,
        route.path,
        type,
        parent,
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
  other: any
) {
  return {
    name,
    path,
    type,
    parent,
    title: other.title || "",
    permission: parent ? PermissionType.Page : PermissionType.Route,
    date: other.date || new Date(),
    author: other.author || "shellingfordly",
    tag: other.tag || "unknown",
  };
}

export function getRouteMap(baseRoute: RouteRecordNormalized[]) {
  let routeMap = cloneDeep(getBaseRouteMap(baseRoute));
  const allRoutes: RouteMap = {};

  Object.values(routeMap).forEach((route) => {
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

  routeMap = undefined;
  return allRoutes;
}
