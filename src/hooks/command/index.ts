import { ErrorType, CommandType } from "@/enum";
import { useStore } from "@/store";
import { HistoryModel, RouteItem, RouteMap } from "@/types";
import {
  createCdCommand,
  createCatCommand,
  createHelpCommand,
  createLlCommand,
  createFindCommand,
  createOpenCommand,
  createSearchCommand,
  createClearCommand,
} from "@/utils/createCommand";
import { EmptyResult, ErrorResult } from "./handleResult";

// 指令内容缓存
export const history = reactive<HistoryModel>({
  routes: [],
  path: "",
});
// 指令结果
export const commandList = ref<any[]>([]);

// 命令处理事件
const commandHandleMap = {
  cd: createCdCommand(),
  cat: createCatCommand(),
  ll: createLlCommand(),
  help: createHelpCommand(),
  find: createFindCommand(),
  open: createOpenCommand(),
  search: createSearchCommand(),
  s: createSearchCommand(),
  clear: createClearCommand(),
};

type CommandKey = keyof typeof commandHandleMap;

export function useCommand() {
  const store = useStore();

  onUnmounted(() => {
    history.routes = [];
    history.path = "";
  });

  const handleCommand = (comStr: string) => {
    let { command, value } = parseCommandString(comStr);
    // 没有指令返回空结果
    if (!command) return EmptyResult();

    const handleCommand = commandHandleMap[command as CommandKey];
    if (!!handleCommand) {
      return handleCommand(store.routeMap, value, store.allRoutes as any);
    } else {
      return ErrorResult({
        errorType: ErrorType.Command,
        value: value || history.path,
        errorValue: command,
      });
    }
  };

  return { handleCommand, commandList };
}

// 解析命令字符串
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
): RouteItem | RouteMap | null {
  const len = history.routes.length;
  const route = len ? history.routes[len - 1] : null;
  if (!route) return null;

  switch (type) {
    case CommandType.CD:
      return (key && route.children?.[key]) || null;
    case CommandType.LL:
      return route.children || null;
    default:
      return route;
  }
}
