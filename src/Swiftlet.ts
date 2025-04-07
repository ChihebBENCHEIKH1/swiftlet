import http, { Server, IncomingMessage, ServerResponse } from "http";
import debugLog from "./utils/debugLog";
import { IRoute } from "./interfaces/IRoute";
import { IRequest } from "./interfaces/IRequest";
import parseUrlQuery from "./modules/parseUrlQuery";
import { IResponse } from "./interfaces/IResponse";

export default class Swiftlet {
  private host: string = "127.0.0.1";
  private port: number = 0;
  private debug: boolean = false;

  private routes: Array<IRoute> = [];

  constructor(port: number | string = 8080, host?: string, debug?: boolean) {
    this.port = typeof port == "string" ? parseInt(port) : port;
    this.host = host ? host : this.host;
    this.debug = debug ? debug : this.debug;

    this.start();
  }

  private server: Server = http.createServer(
    (req: IncomingMessage, res: ServerResponse): void => {
      let responseSent = false;
      const url: string = req.url ? req.url.split("?")[0] : "/";

      const haveQuery: boolean = req.url?.split("?")[1] ? true : false;

      const query: QueryTupleArray = haveQuery
        ? parseUrlQuery(req.url ? req.url.split("?")[1] : "")
        : undefined;
      for (let route of this.routes) {
        if (url === route.endpoint) {
          const searchRequest: IRequest = {
            query: (idx: string): string | undefined => {
              for (let tuple of query ? query : []) {
                if (idx === tuple[0]) return tuple[1];
              }
            },
            param: [""],
            body: {},
          };

          const routeRes: IResponse = route.response(searchRequest);

          if (this.debug)
            debugLog([
              `REQUEST [${new Date().toLocaleString()}]:`,
              route.method.toUpperCase(),
              routeRes.statusCode,
              `http://${this.host}:${this.port}${req.url}`,
            ]);

          res.writeHead(routeRes.statusCode, {
            "Content-Type": "application/json",
          });
          res.write(JSON.stringify(routeRes.json));
          res.end();
          responseSent = true;
          break;
        }
      }

      if (!responseSent) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end(`Invalid route ${req.url}`);
      }
    }
  );

  private start(): void {
    this.server.listen(this.port, this.host, (): void =>
      console.log("running on port:", this.port)
    );
  }

  public route(route: IRoute): void {
    this.routes.push(route);
  }
}
