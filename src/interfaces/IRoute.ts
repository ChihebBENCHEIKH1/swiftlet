export interface IRoute {
  method: ReqMethod;
  endpoint: string;
  body?: string;
  callback?: Function;
  res: {
    statusCode: number;
    json: any;
  };
}
