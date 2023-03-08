import { LastRoute, RootRoute, ALL, helpCommand } from "@/contants";
import { CommandType, ErrorType, FileType, ResultType } from "@/enum";
import { commandList, getHistoryRoute, history } from "@/hooks/useCommand";
import { CommandModel, RouteItem, RouteMap } from "@/types";
import { handleRoute, handleEmpty, handleError } from "./handleResult";

function handlePaths(paths: string, callback: (path: string) => void) {
  paths.split("/").forEach(callback);
}

export function createCdCommand() {
  return (routerMap: any, value: string) => {
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

    handlePaths(value, (path: string) => {
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
  return (routerMap: any, value: string, allRoutes: RouteMap) => {
    let content: any;
    let _value = "";

    if (value === ALL) {
      content = Object.values(allRoutes).filter(
        (v) => v.fileType === FileType.Page
      );
    } else {
      content = getHistoryRoute() || routerMap;
      if (value) {
        handlePaths(value, (path: string) => {
          content = content[path] || content.children[path];
        });
      }
    }

    return handleRoute({ value: _value, content });
  };
}

export function createCatCommand() {
  return (routerMap: any, value: string) => {
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
  return (_: any, value: string) => {
    return {
      type: ResultType.Help,
      content: helpCommand,
      value,
    };
  };
}

export function createFindCommand() {
  return (_: any, value: string, allRoutes: RouteMap) => {
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

export function createOpenCommand() {
  function handleValue(value: string) {
    let url = "https://";
    if (value.includes("www")) {
      url += value;
    } else {
      url += "www." + value;
    }
    if (!value.includes(".com")) {
      url += ".com";
    }
    window.open(url);
  }

  return (_: any, value: string) => {
    if (value) handleValue(value);
    return handleRoute();
  };
}

export function createSearchCommand() {
  class SearchType {
    baidu = "https://www.baidu.com/s?wd=";
    google = "https://www.google.com/search?q=";
    b = this.baidu;
    g = this.google;
  }
  function handleValue(value: string) {
    const [_, searchKey] = value.split(":");
    const map = new SearchType();
    Object.keys(map).forEach((key) => {
      if (value.includes(key)) {
        const url = (map as any)[key] + searchKey;
        window.open(url);
      }
    });
  }

  return (_: any, value: string) => {
    if (value) handleValue(value);
    return handleRoute();
  };
}

export function createClearCommand() {
  return (): CommandModel => {
    return {
      type: ResultType.Clear,
    };
  };
}
