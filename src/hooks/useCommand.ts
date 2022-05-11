import { useRouter } from "vue-router";

export enum CommandType {
  Route,
  Page,
  ErrorCommand,
  ErrorRoute,
  ErrorPage,
}

const commandMap = {
  cd(router, value: string) {
    if (value === "home") {
      return {
        type: CommandType.Route,
        value,
      };
    } else {
      return {
        type: CommandType.ErrorRoute,
        value,
      };
    }
  },
  cat() {},
  ll(router, value: string) {
    return {
      type: CommandType.Route,
      value,
    };
  },
};

export function useCommand() {
  const router = useRouter();

  return (comStr: string) => {
    const { command, content } = parseCommandString(comStr);
    const handleCommand = commandMap[command];
    if (handleCommand) {
      return handleCommand(router, content);
    } else {
      return {
        type: CommandType.ErrorCommand,
        value: command,
      };
    }
  };
}

// cd /home

function parseCommandString(comStr: string) {
  const comArr = comStr.split(" ");

  return {
    command: comArr[0],
    content: comArr[1],
  };
}
