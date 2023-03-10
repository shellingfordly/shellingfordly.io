import { CommandHandleResult } from "@/types/index";
import { CommandHandleType } from "@/enum";
import { useStore } from "@/store";
import { CommandHandle } from "./commandHandle";

const commandHandle = new CommandHandle();
const commandResultList = ref<CommandHandleResult[]>([]);

export function useCommand() {
  const store = useStore();

  commandHandle.init({
    filesMap: store.treeFilesMap,
    allFileList: store.allFileList,
  });

  const getCommandCache = () => commandHandle.getCommandCache();
  const getPathCache = () => commandHandle.getPathCache();

  const handleCommand = (comStr: string) => {
    if (!comStr) return;
    commandHandle.setCommandStr(comStr);

    const result = commandHandle.run();

    console.log(result)

    if (result.type == CommandHandleType.Clear) {
      commandResultList.value = [];
    } else {
      commandResultList.value.push(result);
    }
  };

  return { commandResultList, handleCommand, getCommandCache, getPathCache };
}
