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
  Unknown,
  Help,
}

export enum CommandHandleCode {
  Ok,
  NotFind,
  NotFindDir,
  NotFindFile,
  Error,
  NotCommand,
  NotValue,
  Success,
}

export enum FileType {
  File = "--article--",
  Dir = "--directory--",
}

export enum CommandResultType {
  Dir,
  ViewDir,
  File,
  ViewFile,
  String,
  Link,
  Help,
}
