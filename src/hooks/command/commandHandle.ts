import { cloneDeep } from "lodash";
import { ALL, RootDir, LastDir } from "@/contants";
import { CommandHandleCode, CommandHandleType } from "@/enum";
import { FilesMap, FileInfo, CommandHandleResult } from "@/types";

interface CommandHandleProps {
  filesMap: FilesMap;
  allFileList: FileInfo[];
}

type CommandHandleMap = Record<string, (...arg: any) => any>;

export class CommandHandle {
  // 指令缓存
  commandCache: string[] = [];
  // 目录缓存
  pathCache: string[] = [];

  // 文件结构map
  filesMap: FilesMap = {};
  // 所有文章文件
  allFileList: FileInfo[] = [];
  // 指令
  commandStr = "";

  constructor({ filesMap, allFileList }: CommandHandleProps) {
    this.filesMap = filesMap;
    this.allFileList = allFileList;
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

  get getCommandCache() {
    return cloneDeep(this.commandCache);
  }

  get getPathCache() {
    return cloneDeep(this.pathCache);
  }

  setCommandStr(commandStr: string) {
    this.commandStr = commandStr;
    this.commandCache.push(commandStr);
  }

  run() {
    const c = this.commandStrHandle();
    const dirCommand = ["ll", "cd", "cat"];

    if (dirCommand.includes(c.command)) {
      this.dirHandle(c.value);
    }

    type key = keyof typeof this.handleMap;

    let result: CommandHandleResult;
    // 特殊指令
    if (c.command.includes(":")) {
      const [com, attr] = c.command.split(":");
      result = this.handleMap[com as key].call(this, attr, c.value);
    } else {
      result = this.handleMap[c.command as key].call(this, c.value);
    }
    return result;
  }

  /**
   * 文件目录处理
   * @param value 目录
   * @returns
   */
  dirHandle(value: string) {
    // 没有输入目录
    if (!value) {
      return;
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

    // 更新 目录缓存
    this.pathCache = this.pathCache.concat(paths);
  }

  /**
   * 解析指令字符串
   * @returns
   *  @command 指令
   *  @value 内容
   */
  commandStrHandle() {
    const [command = "", value = ""] = this.commandStr
      .split(" ")
      .map((c) => c.trim())
      .filter((c) => c);

    return {
      command,
      value,
    };
  }

  cdCommand(value?: string): CommandHandleResult {
    let content: FilesMap = {};
    let path = "";
    let code = CommandHandleCode.Ok;

    // 没有path 返回根目录
    if (!this.pathCache.length) {
      content = cloneDeep(this.filesMap);
      path = RootDir;
    } else {
      let _content: FilesMap = {};
      // 遍历目录树找到path目录
      for (const _path of this.pathCache) {
        path = _path;
        if (this.filesMap[_path]) {
          _content = this.filesMap[_path].children;
        } else {
          code = CommandHandleCode.NotFind;
          break;
        }
      }
      content = _content;
    }

    return {
      type: CommandHandleType.Cd,
      code,
      content,
      path,
    };
  }
  llCommand(): CommandHandleResult {
    const result = this.cdCommand();

    return {
      ...result,
      type: CommandHandleType.Ll,
    };
  }
  catCommand(): CommandHandleResult {
    const result = this.cdCommand();

    return {
      ...result,
      type: CommandHandleType.Cat,
    };
  }
  findCommand(value: string = ""): CommandHandleResult {
    const content = this.allFileList.filter(
      (f) =>
        f.fileName.includes(value) ||
        f.path.includes(value) ||
        f.author.includes(value) ||
        f.tag.includes(value) ||
        f.title.includes(value)
    );
    const code = content.length
      ? CommandHandleCode.Ok
      : CommandHandleCode.NotFind;

    return {
      type: CommandHandleType.Find,
      code,
      content,
      path: "",
    };
  }
  openCommand(value = ""): CommandHandleResult {
    let code = CommandHandleCode.Ok;
    if (!value) {
      code = CommandHandleCode.Error;
    }
    let url = "https://";
    if (value.includes("www")) {
      url += value;
    } else {
      url += "www." + value;
    }
    if (!value.includes(".com")) {
      url += ".com";
    }

    return {
      code,
      type: CommandHandleType.Open,
      content: url,
      path: "",
    };
  }
  searchCommand(attr: string, value: string): CommandHandleResult {
    const baseUrl: any = {
      baidu: "https://www.baidu.com/s?wd=",
      google: "https://www.google.com/search?q=",
      b: "",
      g: "",
    };
    baseUrl.b = baseUrl.baidu;
    baseUrl.g = baseUrl.google;

    let url = baseUrl[attr];
    let code = CommandHandleCode.Ok;

    if (!url) {
      code = CommandHandleCode.NotCommand;
    } else if (value) {
      url += value;
    }

    return {
      code,
      type: CommandHandleType.Search,
      content: url,
      path: "",
    };
  }
  clearCommand(value: string): CommandHandleResult {
    if (value === ALL) {
      this.pathCache = [];
      this.commandCache = [];
    }

    return {
      code: CommandHandleCode.Ok,
      type: CommandHandleType.Clear,
      content: "",
      path: "",
    };
  }
}
