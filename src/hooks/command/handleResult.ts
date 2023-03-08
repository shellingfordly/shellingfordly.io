import { ResultType } from "@/enum";
import { CommandModel } from "@/types";

export function EmptyResult(): CommandModel {
  return {
    type: ResultType.Empty,
  };
}

export function RouteResult({
  value = "",
  content,
}: Partial<CommandModel> = {}): CommandModel {
  return {
    type: ResultType.Route,
    content,
    value,
  };
}

export function ErrorResult({
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

