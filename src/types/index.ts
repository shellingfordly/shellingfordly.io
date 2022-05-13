import { ResultType, ErrorType } from "@/enum";

export interface CommandModel {
  type: ResultType;
  value: string;
  errorType?: ErrorType;
  errorValue?: string;
  content?: Partial<RouteItem>;
}

export interface RouteItem {
  name: string;
  path: string;
  type: ResultType;
  parent: string;
  title: string;
  permission: string;
  date: string;
  author: string;
  tag: string;
  children?: RouteMap;
}

export type RouteMap = Record<string, RouteItem>;

export interface HistoryModel {
  routes: RouteItem[];
  path: string;
}
