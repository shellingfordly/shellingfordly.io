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
}

export enum ErrorType {
  Command,
  Route,
  Page,
  NotRoute,
  NotPage,
  NotFindRouteOrPage,
}

export enum PermissionType {
  Route = "--directory--",
  Page = "--article--",
}
