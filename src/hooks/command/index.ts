import { CommandHandleResult } from "@/types";
import type { ComputedRef, Ref } from "vue";
import { useCommand as _useCommand } from "./useCommand";

let commandList: ComputedRef<CommandHandleResult[]> | null = null;
let handleCommand = (comStr: string) => {};
let getCommandCache = (): string[] => [];
let getPathCache = (): string[] => [];

export function useCommand() {
  const command = _useCommand();

  commandList = computed(() => command.commandList.value);
  handleCommand = command.handleCommand;
  getCommandCache = command.getCommandCache;
  getPathCache = command.getPathCache;
}

export { commandList, handleCommand, getCommandCache, getPathCache };
