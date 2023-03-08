import { AUTHOR, DEFAULT_TIME, UNKNOWN } from "@/contants";
import { ResultType, FileType } from "@/enum";
import { RouteMap } from "@/types";
import { cloneDeep } from "lodash";
import { RouteRecordNormalized } from "vue-router";

export function getBaseRouteMap(baseRoute: RouteRecordNormalized[]) {
  const routeMap: RouteMap = {};
  const isNotPage = (route: RouteRecordNormalized) => {
    const other: any = route.meta.frontmatter;
    const l = route.path.match(/\//g);
    return (l && l.length > 1) || other.notPage;
  };

  Object.values(baseRoute).forEach((route) => {
    if (isNotPage(route)) {
      handleRoute(route, routeMap);
    } else {
      routeMap[route.name as string] = createRouteItem({
        path: route.path,
        other: route.meta.frontmatter,
        key: route.name,
        type: ResultType.Page,
        fileType: FileType.Page,
        parent: null,
      });
    }
  });

  return routeMap;
}

function handleRoute(route: RouteRecordNormalized, routeMap: RouteMap) {
  const { path } = route;
  const other: any = route.meta.frontmatter;
  const pathList = path.slice(1).split("/");

  const len = pathList.length;
  for (let i = 0; i < pathList.length; i++) {
    const key = pathList[i];
    const isPage = i === len - 1 && !other.notPage;
    let fileType = isPage ? FileType.Page : FileType.Route;
    let type = isPage ? ResultType.Page : ResultType.Route;
    let parent = i > 0 ? pathList[i - 1] : null;

    routeMap[key] = createRouteItem({
      path,
      other,
      key,
      type,
      parent,
      fileType,
    });
  }
}

function createRouteItem({ path, other, type, key, fileType, parent }: any) {
  return {
    key,
    name: other.name,
    path,
    type,
    parent,
    fileType,
    date: other.date || new Date(DEFAULT_TIME),
    author: other.author || AUTHOR,
    tag: other.tag || UNKNOWN,
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
    route.index = sortMap[route.key];
    if (!route.parent) {
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

  return allRoutes;
}
