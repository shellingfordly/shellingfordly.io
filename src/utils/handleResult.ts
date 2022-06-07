import { ResultType } from "@/enum";
import { CommandModel } from "@/types";

export function handleEmpty(): CommandModel {
  return {
    type: ResultType.Empty,
  };
}

export function handleRoute({
  value = "",
  content,
}: Partial<CommandModel> = {}): CommandModel {
  return {
    type: ResultType.Route,
    content,
    value,
  };
}

export function handleError({
  errorType,
  errorValue,
  value = "",
}: Partial<CommandModel>): CommandModel {
  return {
    type: ResultType.Error,
    errorValue,
    errorType,
    value,
  };
}
