export interface ICompileStrategy {
  compile(): Promise<boolean>
}
