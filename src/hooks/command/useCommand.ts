import { CommandHandleResult } from "@/types/index";
import { CommandHandleType, CommandResultType } from "@/enum";
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

  const router = useRouter();

  const handleCommand = (comStr: string) => {
    if (!comStr) return {} as any;
    commandHandle.setCommandStr(comStr);

    const result = commandHandle.run();

    if (result.type == CommandHandleType.Clear) {
      commandResultList.value = [];
    } else {
      commandResultList.value.push(result);
    }

    if (result.resultType == CommandResultType.ViewFile) {
      router.push(result.path as string);
    }

    return result;
  };

  return { commandResultList, handleCommand, getCommandCache, getPathCache };
}
