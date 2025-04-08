interface IQueryGet {
  (idx: string): string | undefined;
}
interface IParamGet {
  (idx: string): string | undefined;
}

export interface IRequest {
  query: IQueryGet;
  param: IParamGet;
  body: any;
}
