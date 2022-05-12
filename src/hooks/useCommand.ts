import { CommandType, ErrorType } from "@/enum";
import { useStore } from "@/store";
import { CommandModel } from "@/types";

// 指令内容缓存
export const commandValue = ref("");

const commandMap = {
  cd(routerMap, value: string) {
    const isLegalRoute = Object.keys(routerMap).includes(value);
    if (isLegalRoute) {
      commandValue.value = value;
      return handleRoute(value);
    } else {
      return handleError({
        errorType: ErrorType.Route,
        errorValue: value,
        value: commandValue.value,
      });
    }
  },
  cat(routerMap, value: string) {},
  ll(routerMap, value: string) {
    return handleRoute(value || commandValue.value);
  },
  help(routerMap, value: string) {},
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
        errorValue: command,
        value: value || commandValue.value,
      });
    }
  };
}

function parseCommandString(comStr: string) {
  const comArr = comStr.split(" ");
  return {
    command: comArr[0],
    value: comArr[1],
  };
}

function handleRoute(value: string): CommandModel {
  return {
    type: CommandType.Route,
    value,
  };
}

function handleError({
  errorType,
  errorValue,
  value = "",
}: Partial<CommandModel>): CommandModel {
  return {
    type: CommandType.Error,
    errorType,
    errorValue,
    value,
  };
}
