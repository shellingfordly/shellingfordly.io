import { helpCommand, LastRoute, RootRoute } from "@/contants";
import { ResultType, ErrorType, CommandType } from "@/enum";
import { useStore } from "@/store";
import { CommandModel, HistoryModel, RouteItem, RouteMap } from "@/types";

// 指令内容缓存
export const history = reactive<HistoryModel>({
  routes: [],
  path: "",
});

const commandMap = {
  cd(routerMap, value: string) {
    if (value === undefined || value === RootRoute) {
      history.routes = [];
      return handleRoute("");
    }

    let route: RouteItem;

    if (value === LastRoute) {
      history.routes.pop();
      value = "";
      route = getHistoryRoute() as RouteItem;
    } else {
      route = getHistoryRoute(CommandType.CD, value) || routerMap[value];
    }

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
  },
  cat(routerMap, value: string) {
    const route = getHistoryRoute(CommandType.CD, value) || routerMap[value];

    if (!route) {
      return handleError({
        errorType: ErrorType.NotPage,
        value: history.path,
        errorValue: value,
      });
    } else {
      if (route.type === ResultType.Page) {
        return {
          type: ResultType.Page,
          content: route,
          value,
        };
      }
    }
  },
  ll(routerMap, value: string) {
    const route = getHistoryRoute() || routerMap;
    return handleRoute(value, route);
  },
  help(routerMap, value: string) {
    return {
      type: ResultType.Help,
      content: helpCommand,
      value,
    };
  },
};

export function useCommand() {
  const store = useStore();

  return (comStr: string) => {
    const { command, value } = parseCommandString(comStr);
    const handleCommand = commandMap[command];
    if (!!handleCommand) {
      return handleCommand(store.routeMap, value);
    } else {
      return handleError({
        errorType: ErrorType.Command,
        value: value || history.path,
        errorValue: command,
      });
    }
  };
}

function parseCommandString(comStr: string) {
  const comArr = comStr
    .split(" ")
    .map((c) => c.trim())
    .filter((c) => c);

  return {
    command: comArr[0],
    value: comArr[1],
  };
}

function handleRoute(
  value: string,
  content: Partial<RouteItem> = {}
): CommandModel {
  return {
    type: ResultType.Route,
    content,
    value,
  };
}

function handleError({
  errorType,
  errorValue,
  value = "",
}: Partial<CommandModel>): CommandModel {
  return {
    type: ResultType.Error,
    errorValue,
    errorType,
    value,
  };
}

export function getHistoryRoute(
  type?: CommandType,
  key?: string
): RouteItem | RouteMap | null {
  const len = history.routes.length;
  const route = len ? history.routes[len - 1] : null;
  if (!route) return null;

  switch (type) {
    case CommandType.CD:
      return (key && route.children[key]) || null;
    case CommandType.LL:
      return route.children;
    default:
      return route;
  }
}
