import { ResultType } from "@/enum";
import { CommandModel, RouteItem, RouteMap } from "@/types";

export function handleEmpty() {
  return {
    type: ResultType.Empty,
  };
}

export function handleRoute(
  value: string,
  content?: RouteItem[] | RouteItem | RouteMap
): CommandModel {
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
