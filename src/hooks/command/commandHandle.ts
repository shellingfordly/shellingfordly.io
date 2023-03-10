import { cloneDeep } from "lodash";
import { RootDir, LastDir } from "@/contants";
import {
  CommandHandleCode,
  CommandHandleType,
  CommandResultType,
} from "@/enum";
import { FilesMap, FileInfo, CommandHandleResult, CommandInfo } from "@/types";

interface CommandHandleProps {
  filesMap: FilesMap;
  allFileList: FileInfo[];
  commandStr?: string;
}

type CommandHandleMap = Record<string, (...arg: any) => any>;

export class CommandHandle {
  // 指令缓存
  commandCache: string[] = [];
  // 目录缓存
  pathCache: string[] = [];

  // 文件结构map
  filesMap: FilesMap = {};
  // 当前所在文件目录
  nowFilesMap: FilesMap = {};
  // 所有文章文件
  allFileList: FileInfo[] = [];
  // 指令
  commandStr = "";

  constructor() {}

  init({ filesMap, allFileList, commandStr }: CommandHandleProps) {
    this.filesMap = this.nowFilesMap = filesMap;
    this.allFileList = allFileList;
    if (commandStr) {
      this.setCommandStr(commandStr);
    }
  }

  // 指令处理handle map
  handleMap: CommandHandleMap = {
    cd: this.cdCommand,
    ll: this.llCommand,
    cat: this.catCommand,
    find: this.findCommand,
    open: this.openCommand,
    search: this.searchCommand,
    s: this.searchCommand,
    clear: this.clearCommand,
  };

  getCommandCache() {
    return [...this.commandCache];
  }

  getPathCache() {
    return [...this.pathCache];
  }

  setCommandStr(commandStr: string) {
    this.commandStr = commandStr;
    this.commandCache.push(commandStr);
  }

  run(): CommandHandleResult {
    let command = this.commandStrHandle();

    if (this.handleMap.hasOwnProperty(command.command)) {
      return this.handleMap[command.command].call(this, command);
    }

    return {
      code: CommandHandleCode.NotCommand,
      command,
    };
  }

  /**
   * 处理path
   * @param value 目录
   * @returns
   */
  pathHandle(value: string) {
    // 没有输入目录
    if (!value) {
      return [];
    }

    let paths: string[] = [];
    const createPaths = (str?: string) => {
      if (str) value = value.replace(str, "");
      return value
        .split("/")
        .map((v) => v.trim())
        .filter((v) => v);
    };

    // 根目录开头
    if (value.startsWith(RootDir)) {
      this.pathCache = [];
      paths = createPaths(RootDir);
    }
    // 上级目录开头
    else if (value.startsWith(LastDir)) {
      const lastPath = this.pathCache.pop();
      if (lastPath) {
        paths = createPaths(LastDir);
      }
    }
    // 当前目录开头
    else {
      paths = createPaths();
    }

    return paths;
  }

  fileHandle(paths: string[]) {
    let content: FilesMap = {};
    // 没有path 返回根目录
    if (!paths.length) {
      content = cloneDeep(this.filesMap);
    } else {
      let _content: FilesMap = {};
      // 遍历当前目录树找到path目录
      for (const _path of paths) {
        if (!this.nowFilesMap[_path]) {
          return {};
        }
        _content = this.nowFilesMap[_path].children;
      }
      content = _content;

      if (JSON.stringify(_content) != "{}") {
        this.pathCache = this.pathCache.concat(paths);
      }
    }

    return content;
  }

  /**
   * 解析指令字符串
   * @returns
   *  @command 指令
   *  @prop 指令特殊参数
   *  @value 内容
   */
  commandStrHandle(): CommandInfo {
    let [command, value] = this.commandStr
      .split(" ")
      .map((c) => c.trim())
      .filter((c) => c);

    // 特殊指令参数
    let prop = "";
    if (command.includes(":")) {
      const [_command, _prop] = command.split(":");
      command = _command;
      prop = _prop;
    }

    return {
      original: this.commandStr,
      command: command || "",
      prop,
      value: value || "",
    };
  }

  /**
   *  处理cd指令
   * @param command CommandInfo
   * @returns CommandHandleResult
   */
  cdCommand(command: CommandInfo): CommandHandleResult {
    let code = CommandHandleCode.Ok;

    const paths = this.pathHandle(command.value);
    const content = this.fileHandle(paths);

    let path = paths[paths.length - 1] || "";

    if (JSON.stringify(content) == "{}") {
      code = CommandHandleCode.NotFindDir;
    }

    return {
      code,
      type: CommandHandleType.Cd,
      resultType: CommandResultType.Dir,
      content,
      path,
      command,
    };
  }

  /**
   * 处理ll指令
   */
  llCommand(command: CommandInfo): CommandHandleResult {
    command.value = command.value || this.pathCache[this.pathCache.length - 1];
    const result = this.cdCommand(command);

    return {
      ...result,
      type: CommandHandleType.Ll,
      resultType: CommandResultType.ViewDir,
    };
  }

  /**
   * 处理cat指令
   */
  catCommand(cInfo: CommandInfo): CommandHandleResult {
    const result = this.cdCommand(cInfo);

    return {
      ...result,
      type: CommandHandleType.Cat,
      resultType: CommandResultType.ViewFile,
    };
  }

  /**
   * 处理find指令
   */
  findCommand(command: CommandInfo): CommandHandleResult {
    const value = command.value;

    const content = this.allFileList.filter((file) => {
      const { fileName, path, author, tag, title } = file;
      return (
        (fileName && fileName.includes(value)) ||
        (path && path.includes(value)) ||
        (author && author.includes(value)) ||
        (tag && tag.includes(value)) ||
        (title && title.includes(value))
      );
    });

    const code = content.length
      ? CommandHandleCode.Ok
      : CommandHandleCode.NotFind;

    return {
      type: CommandHandleType.Find,
      resultType: CommandResultType.ViewDir,
      code,
      content,
      path: "",
      command,
    };
  }

  /**
   * 处理open指令
   */
  openCommand(command: CommandInfo): CommandHandleResult {
    let code = CommandHandleCode.Ok;
    const value = command.value;
    let url = "https://";
    if (value) {
      if (value.includes("www")) {
        url += value;
      } else {
        url += "www." + value;
      }
      if (!value.includes(".com")) {
        url += ".com";
      }
    } else {
      code = CommandHandleCode.NotValue;
    }

    return {
      code,
      type: CommandHandleType.Open,
      resultType: CommandResultType.Link,
      content: url,
      path: "",
      command,
    };
  }

  /**
   * 处理search指令
   */
  searchCommand(command: CommandInfo): CommandHandleResult {
    const baseUrl: any = {
      baidu: "https://www.baidu.com/s?wd=",
      google: "https://www.google.com/search?q=",
      b: "",
      g: "",
    };
    baseUrl.b = baseUrl.baidu;
    baseUrl.g = baseUrl.google;

    let url = baseUrl[command.prop];
    let code = CommandHandleCode.Ok;

    if (!url) {
      code = CommandHandleCode.NotValue;
    } else if (command.value) {
      url += command.value;
    }

    return {
      code,
      type: CommandHandleType.Search,
      resultType: CommandResultType.Link,
      content: url,
      path: "",
      command,
    };
  }

  /**
   * 处理clear指令
   */
  clearCommand(command: CommandInfo): CommandHandleResult {
    return {
      code: CommandHandleCode.Ok,
      type: CommandHandleType.Clear,
      resultType: CommandResultType.String,
      content: "",
      path: "",
      command,
    };
  }
}
