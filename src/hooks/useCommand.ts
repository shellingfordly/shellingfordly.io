import { ErrorType, CommandType } from "@/enum";
import { useStore } from "@/store";
import { HistoryModel, RouteItem, RouteMap } from "@/types";
import {
  createCdCommand,
  createCatCommand,
  createHelpCommand,
  createLlCommand,
} from "@/utils/createCommand";
import { handleEmpty, handleError } from "@/utils/handle";

// 指令内容缓存
export const history = reactive<HistoryModel>({
  routes: [],
  path: "",
});
const commandMap = {
  cd: createCdCommand(),
  cat: createCatCommand(),
  ll: createLlCommand(),
  help: createHelpCommand(),
};

export function useCommand() {
  const store = useStore();

  onUnmounted(() => {
    history.routes = [];
    history.path = "";
  });

  return (comStr: string) => {
    const { command, value } = parseCommandString(comStr);
    const handleCommand = commandMap[command];
    if (!command) {
      return handleEmpty();
    }
    if (!!handleCommand) {
      return handleCommand(store.routeMap, value, store.allRoutes);
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

export function getHistoryRoute(
  type?: CommandType,
  key?: string
): RouteItem | RouteItem[] | RouteMap | null {
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
