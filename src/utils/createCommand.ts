import { LastRoute, RootRoute, ALL, helpCommand } from "@/contants";
import { CommandType, ErrorType, FileType, ResultType } from "@/enum";
import { getHistoryRoute, history } from "@/hooks/useCommand";
import { RouteItem, RouteMap } from "@/types";
import { handleRoute, handleEmpty, handleError } from "./handle";

export function createCdCommand() {
  return (routerMap, value: string) => {
    if (value === undefined || value === RootRoute) {
      history.routes = [];
      return handleRoute("");
    }

    let route: RouteItem;

    if (value === LastRoute) {
      history.routes.pop();
      value = "";
      route = getHistoryRoute() as RouteItem;
      return handleEmpty();
    } else {
      route = getHistoryRoute(CommandType.CD, value) || routerMap[value];
    }
    console.log("cd", value, routerMap, routerMap[value]);

    if (route && route.type === ResultType.Route) {
      history.routes.push(route as RouteItem);
      history.path = value;
      return handleRoute(value);
    } else {
      return handleError({
        errorType: ErrorType.NotRoute,
        value: history.path,
        errorValue: value,
      });
    }
  };
}
export function createLlCommand() {
  return (routerMap, value: string, allRoutes: RouteMap) => {
    if (value === ALL) {
      const content = Object.values(allRoutes).filter(
        (v) => v.fileType === FileType.Page
      );
      return handleRoute("", content);
    }
    const content = getHistoryRoute() || routerMap;
    return handleRoute(value, content);
  };
}

export function createCatCommand() {
  return (routerMap, value: string) => {
    const route = getHistoryRoute(CommandType.CAT, value) || routerMap[value];
    let errorType = ErrorType.NotPage;
    if (!route) errorType = ErrorType.Page;

    if (route && route.type === ResultType.Page) {
      return {
        type: ResultType.Page,
        content: route,
        value,
      };
    }

    return handleError({
      errorType,
      value: history.path,
      errorValue: value,
    });
  };
}

export function createHelpCommand() {
  return (_, value: string) => {
    return {
      type: ResultType.Help,
      content: helpCommand,
      value,
    };
  };
}

export function createFindCommand() {
  return (_, value: string, allRoutes: RouteMap) => {
    const content = Object.values(allRoutes).filter(
      (v) => v.name.includes(value) && v.fileType == FileType.Page
    );
    if (!content.length) {
      return handleError({ errorType: ErrorType.NotFind, errorValue: value });
    }
    return handleRoute("", content);
  };
}
