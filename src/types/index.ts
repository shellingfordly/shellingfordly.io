import { ResultType, ErrorType } from "@/enum";

export interface CommandModel {
  type: ResultType;
  value: string;
  errorType?: ErrorType;
  errorValue?: string;
  content?: RouteItem | RouteItem[] | RouteMap;
}

export interface RouteItem {
  key: string;
  name: string;
  path: string;
  type: ResultType;
  parent: string;
  fileType: string;
  date: string;
  author: string;
  tag: string;
  children?: RouteMap;
  index?: number;
}

export type RouteMap = Record<string, RouteItem>;

export interface HistoryModel {
  routes: RouteItem[];
  path: string;
}
