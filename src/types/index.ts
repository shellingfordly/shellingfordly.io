import { CommandHandleCode, CommandHandleType } from "./../enum/index";
import { CommandResultType, FileType } from "@/enum";
import { RouteRecordNormalized } from "vue-router";

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

export interface CommandHandleResult {
  code: CommandHandleCode;
  type?: CommandHandleType;
  resultType?: CommandResultType;
  content?: FilesMap | TreeFileItem[] | FileInfo[] | string;
  path?: string;
  command: CommandInfo;
}

export interface CommandInfo {
  original: string;
  command: string;
  prop: string;
  value: string;
}
