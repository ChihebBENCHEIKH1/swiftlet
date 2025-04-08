declare type QueryTupleArray = Array<[string, string]> | undefined;
declare type ReqMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE";
declare type ParamTupleArray = QueryTupleArray;
declare module "@chiheb_ben_cheikh/swiftlet" {
  export default class Swiftlet {
    constructor(
      port: number | string,
      acao?: string,
      host?: string,
      debug?: boolean
    );

    route(route: {
      endpoint: string;
      method: string;
      response: (request: any) => { statusCode: number; json: any };
    }): void;
  }
}
