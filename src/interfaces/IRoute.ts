import { IRequest } from "./IRequest";

interface IResponse {
  (req: IRequest): {
    statusCode: number;
    json: any;
  };
}
export interface IRoute {
  method: ReqMethod;
  endpoint: string;
  response: IResponse;
}
