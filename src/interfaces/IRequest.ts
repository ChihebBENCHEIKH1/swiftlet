interface IQueryGet {
  (idx: string): string | undefined;
}
export interface IRequest {
  query: IQueryGet;
  param: Array<string>;
}
