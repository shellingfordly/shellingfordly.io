export enum CommandType {
  LL,
  CAT,
  CD,
}

export enum FileType {
  File,
  Dir,
}

export enum ResultType {
  Route,
  Page,
  Error,
  Help,
  Empty,
  Clear,
}

export enum ErrorType {
  Command,
  Route,
  Page,
  NotRoute,
  NotPage,
  NotFindRouteOrPage,
  NotFind,
}

export enum FileType {
  Route = "--directory--",
  Page = "--article--",
}
