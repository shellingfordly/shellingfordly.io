import { AUTHOR, DEFAULT_TIME } from "@/contants";
import { FileType } from "@/enum";
import { FilesMap, RouteItem1, FileInfo, TreeFileItem } from "@/types";
import moment from "moment";

/**
 * createAllFilesMap
 * @param routes 路由
 * @returns 扁平化的所有文件信息
 */
export function createAllFilesMap(routes: RouteItem1[]): FileInfo[] {
  return routes
    .filter((route) => route.path.lastIndexOf("/") !== 0)
    .map(createFileItem)
    .sort((f1, f2) => f2.date - f1.date);
}

/**
 * createTreeFilesMap
 * @param routes 路由
 * @returns 树结构的文件结构
 */
export function createTreeFilesMap(routes: RouteItem1[]): FilesMap {
  const allFiles = routes
    .map((route) => {
      const file = createFileItem(route) as TreeFileItem;
      file.parent = "";
      file.children = {};

      if (file.other.isDir) {
        file.type = FileType.Dir;
      } else if (file.path.lastIndexOf("/") !== 0) {
        const i = file.path.slice(1).indexOf("/") + 1;
        file.parent = file.path.slice(1, i);
      }

      return file;
    })
    .sort((f1, f2) => f1.path.length - f2.path.length);

  const TreFilesMap: FilesMap = {};
  allFiles.forEach((file) => {
    if (!file.parent) {
      if (!TreFilesMap[file.fileName]) {
        TreFilesMap[file.fileName] = file;
      }
    } else {
      if (TreFilesMap[file.parent]) {
        TreFilesMap[file.parent].children[file.fileName] = file;
      }
    }
  });

  return TreFilesMap;
}

/**
 * createFileItem
 * @param route 路由
 * @returns 文件信息
 */
export function createFileItem(route: RouteItem1): FileInfo {
  const {
    path,
    meta: { frontmatter },
    name: fname,
  } = route;
  const { name, title, date, author, tag, ...other } = frontmatter;
  const fileName = fname
    ?.toString()
    .slice(fname?.toString().indexOf("-") + 1) as string;

  return {
    path,
    title: name || title,
    fileName,
    type: FileType.File,
    date: moment(date || DEFAULT_TIME).valueOf() / 1000,
    author: author || AUTHOR,
    tag: tag,
    other,
  };
}
