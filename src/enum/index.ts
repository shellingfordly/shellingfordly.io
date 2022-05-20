export enum CommandType {
  LL,
  CAT,
  CD,
}

export enum ResultType {
  Route,
  Page,
  Error,
  Help,
  Empty,
}

export enum ErrorType {
  Command,
  Route,
  Page,
  NotRoute,
  NotPage,
  NotFindRouteOrPage,
}

export enum FileType {
  Route = "--directory--",
  Page = "--article--",
}
