import { CommandHandleResult } from "@/types";
import type { ComputedRef } from "vue";
import { useCommand as _useCommand } from "./useCommand";

let commandResultList: ComputedRef<CommandHandleResult[]> | null = null;
let handleCommand: (_: string) => CommandHandleResult;
let getCommandCache = (): string[] => [];
let getPathCache = (): string[] => [];

export function useCommand() {
  const command = _useCommand();

  commandResultList = computed(() => command.commandResultList.value);

  handleCommand = command.handleCommand;
  getCommandCache = command.getCommandCache;
  getPathCache = command.getPathCache;
}

export { commandResultList, handleCommand, getCommandCache, getPathCache };
