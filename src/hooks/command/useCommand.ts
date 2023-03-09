import { CommandHandleResult } from "./../../types/index";
import { CommandHandleType } from "@/enum";
import { useStore } from "@/store";
import { CommandHandle } from "./commandHandle";

export function useCommand() {
  const store = useStore();
  const commandList = ref<CommandHandleResult[]>([]);

  const commandHandle = new CommandHandle({
    filesMap: store.treeFilesMap,
    allFileList: store.allFileList,
  });

  const getCommandCache = () => {
    return commandHandle.getCommandCache;
  };
  const getPathCache = () => commandHandle.getPathCache;

  const handleCommand = (comStr: string) => {
    if (!comStr) return;
    commandHandle.setCommandStr(comStr);

    const result = commandHandle.run();

    if (result.type == CommandHandleType.Clear) {
      commandList.value = [];
    } else {
      commandList.value.push(result);
    }
  };

  return { commandList, handleCommand, getCommandCache, getPathCache };
}
