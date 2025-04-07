import { IRequest } from "./IRequest";
import { IResponse } from "./IResponse";

interface IResponseFunction {
  (req: IRequest): IResponse;
}
export interface IRoute {
  method: ReqMethod;
  endpoint: string;
  response: IResponseFunction;
}
