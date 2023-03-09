import { CommandHandleCode, CommandHandleType } from "./../enum/index";
import { ResultType, ErrorType, FileType } from "@/enum";
import { RouteRecordNormalized } from "vue-router";

export interface CommandModel {
  type: ResultType;
  value?: string;
  errorType?: ErrorType;
  errorValue?: string;
  content?: RouteItem | RouteItem[] | RouteMap;
}

export interface RouteItem {
  key: string;
  name: string;
  path: string;
  type: ResultType;
  parent: string | null;
  fileType: string;
  date: string;
  author: string;
  tag: string;
  children?: RouteMap;
  index?: number;
}

export interface FileInfo {
  // 文章路由
  path: string;
  // 文章标题
  title: string;
  // 文件类型
  type: FileType;
  fileName: string;
  date: number;
  author: string;
  tag: string;
  // 其他信息
  other: Record<string, string>;
}

export interface RouteItem1 extends RouteRecordNormalized {
  meta: {
    frontmatter: Record<string, string>;
  };
}

export interface TreeFileItem extends FileInfo {
  parent: string;
  children: FilesMap;
}

export type FilesMap = Record<string, TreeFileItem>;

export type RouteMap = Record<string, RouteItem>;

export interface HistoryModel {
  routes: RouteItem[];
  path: string;
}

export interface CommandHandleResult {
  code: CommandHandleCode;
  type: CommandHandleType;
  content: FilesMap | TreeFileItem[] | FileInfo[] | string;
  path: string;
  commandStr?: string;
}
