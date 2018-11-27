export enum FileType {
  File,
  Directory
}

export type File = {
  name: string
  size: number
  hash: string
  type: FileType
}
