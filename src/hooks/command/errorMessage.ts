import { CommandHandleCode } from "@/enum";

export function errorMessageHandle(
  error: CommandHandleCode,
  command: string,
  value: string
) {
  switch (error) {
    case CommandHandleCode.Success:
      return `cmd: ${command} find ${value} success.`;
    case CommandHandleCode.NotCommand:
      return `cmd: command not found: ${command}. See 'help'.`;
    case CommandHandleCode.NotFind:
      return `${command}: not found: ${value}.`;
    case CommandHandleCode.NotFindDir:
      return `${command}: path not found: ${value}.`;
    case CommandHandleCode.NotFindFile:
      return `${command}: page not found: ${value}.`;
    case CommandHandleCode.Error:
      return `${command}: find unknown error: ${value}.`;
    case CommandHandleCode.NotValue:
      return `${command}: value is not null.`;
    default:
      return `unknown command [${command}]: ${value}.`;
  }
}
