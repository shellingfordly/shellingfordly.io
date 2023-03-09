export enum CommandType {
  LL,
  CAT,
  CD,
}
export enum CommandHandleType {
  Ll,
  Cat,
  Cd,
  Find,
  Open,
  Search,
  Clear,
}

export enum CommandHandleCode {
  Ok,
  NotFind,
  Error,
  NotCommand,
  NotValue,
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
