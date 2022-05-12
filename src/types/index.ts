import { CommandType, ErrorType } from "@/enum";

export interface CommandModel {
  type: CommandType;
  value: string;
  errorType?: ErrorType;
  errorValue?: string;
}

export interface RouteItem {
  name: string;
  path: string;
  type: CommandType;
  parent: string;
  title: string;
  permission: string;
  date: string;
  author: string;
  tag: string;
  children?: RouteMap;
}

export type RouteMap = Record<string, RouteItem>;
