import { AUTHOR, DEFAULT_TIME, UNKNOWN } from "@/contants";
import { ResultType, FileType } from "@/enum";
import { FilesMap, RouteItem1, FileInfo } from "@/types";
import { cloneDeep } from "lodash";
import moment from "moment";

export function createAllFilesMap(routes: RouteItem1[]): FileInfo[] {
  return routes
    .filter((route) => route.path.lastIndexOf("/") !== 0)
    .map(createFileItem)
    .sort((f1, f2) => f2.date - f1.date);
}

export function createTreeFilesMap(routes: RouteItem1[]): FilesMap {
  const allFiles = routes.map((route) => {
    const file = createFileItem(route);
    if (route.path) {
      file.type = FileType.Dir;
    }
    return file;
  });
  const TreFilesMap: FilesMap = {};

//   allFiles.forEach();  

  return TreFilesMap
}

export function createFileItem(route: RouteItem1): FileInfo {
  const {
    path,
    meta: { frontmatter },
    name: fname,
  } = route;
  const { name, title, date, author, tag } = frontmatter;
  const fileName = fname
    ?.toString()
    .slice(fname?.toString().indexOf("-") + 1) as string;

  return {
    path,
    title: name || title,
    fileName,
    type: FileType.File,
    date: moment(date).valueOf() / 1000,
    author: author || AUTHOR,
    tag: tag,
  };
}
