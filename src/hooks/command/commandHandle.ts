import { cloneDeep } from "lodash";
import { RootDir, LastDir, CurrentDir } from "@/contants";
import {
  CommandHandleCode,
  CommandHandleType,
  CommandResultType,
  FileType,
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
      return [...this.pathCache];
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
    } else if (value.startsWith(CurrentDir)) {
      paths = createPaths(CurrentDir);
    }
    // 当前目录开头
    else {
      paths = createPaths();
    }

    return this.pathCache.concat(paths);
  }

  fileHandle(paths: string[]) {
    let content: FilesMap = {};
    // 没有path 返回根目录
    if (!paths.length) {
      content = cloneDeep(this.filesMap);
    } else {
      let _content: FilesMap = this.nowFilesMap;
      // 遍历当前目录树找到path目录
      for (const _path of paths) {
        const file = _content[_path];
        if (!file) {
          return {};
        }
        if (file.type === FileType.Dir) {
          _content = _content[_path].children;
        } else if (file.type === FileType.File) {
          return _content[_path];
        }
      }
      content = _content;
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
    // 存一下上一次的文件地址
    let path = this.pathCache[this.pathCache.length - 1] || RootDir;

    const paths = this.pathHandle(command.value);
    const content = this.fileHandle(paths);

    if (JSON.stringify(content) == "{}") {
      code = CommandHandleCode.NotFindDir;
    } else {
      this.pathCache = this.pathCache.concat(paths);
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
    let code = CommandHandleCode.Ok;

    const paths = this.pathHandle(command.value);

    console.log("paths: ", paths);

    const content = this.fileHandle(paths);

    if (JSON.stringify(content) == "{}") {
      code = CommandHandleCode.NotFindDir;
      this.pathCache = this.pathCache.concat(paths);
    }

    command.value = command.value || this.pathCache[this.pathCache.length - 1];

    return {
      code,
      content,
      path: "",
      type: CommandHandleType.Ll,
      resultType: CommandResultType.ViewDir,
      command,
    };
  }

  /**
   * 处理cat指令
   */
  catCommand(command: CommandInfo): CommandHandleResult {
    let code = CommandHandleCode.Success;

    const paths = this.pathHandle(command.value);
    const content = this.fileHandle(paths);

    if (JSON.stringify(content) == "{}") {
      code = CommandHandleCode.NotFindFile;
    }

    return {
      code,
      content,
      command,
      path: (content.path as string) || "",
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
    let code = CommandHandleCode.Success;
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
      window.open(url);
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
    let code = CommandHandleCode.Success;

    if (!url) {
      code = CommandHandleCode.NotValue;
    } else if (command.value) {
      url += command.value;
      window.open(url);
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
