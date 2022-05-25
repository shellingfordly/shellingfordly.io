import { LastRoute, RootRoute, ALL, helpCommand } from "@/contants";
import { CommandType, ErrorType, FileType, ResultType } from "@/enum";
import { getHistoryRoute, history } from "@/hooks/useCommand";
import { RouteItem, RouteMap } from "@/types";
import { handleRoute, handleEmpty, handleError } from "./handle";

function handlePaths(paths: string, callback) {
  paths.split("/").forEach(callback);
}

export function createCdCommand() {
  return (routerMap, value: string) => {
    // 跟路径
    if (value === undefined || value === RootRoute) {
      history.routes = [];
      return handleRoute();
    }
    // 返回上一级
    if (value === LastRoute) {
      history.routes.pop();
      return handleEmpty();
    }

    handlePaths(value, (path) => {
      const route = getHistoryRoute(CommandType.CD, path) || routerMap[path];
      if (route && route.type === ResultType.Route) {
        history.routes.push(route as RouteItem);
        history.path = path;
      }
    });

    if (history.path) {
      return handleRoute({ value: history.path });
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
    let content;
    let _value = "";

    if (value === ALL) {
      content = Object.values(allRoutes).filter(
        (v) => v.fileType === FileType.Page
      );
    } else {
      content = getHistoryRoute() || routerMap;
      if (value) {
        handlePaths(value, (path) => {
          content = content[path] || content.children[path];
        });
      }
    }

    return handleRoute({ value: _value, content });
  };
}

export function createCatCommand() {
  return (routerMap, value: string) => {
    let content = getHistoryRoute(CommandType.CAT) || routerMap;

    handlePaths(value, (path) => {
      content = content[path] || content.children[path];
    });

    if (content && content.type === ResultType.Page) {
      return {
        type: ResultType.Page,
        content,
        value,
      };
    }

    return handleError({
      errorType: content ? ErrorType.NotPage : ErrorType.Page,
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
      (v) =>
        (v.name.includes(value) || v.path.includes(value)) &&
        v.fileType == FileType.Page
    );
    if (!content.length) {
      return handleError({ errorType: ErrorType.NotFind, errorValue: value });
    }
    return handleRoute({ content });
  };
}
