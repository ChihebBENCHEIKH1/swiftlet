import http, { Server, IncomingMessage, ServerResponse } from "http";
import debugLog from "./utils/debugLog";
import { IRoute } from "./interfaces/IRoute";
import { IRequest } from "./interfaces/IRequest";
import parseUrlQuery from "./modules/parseUrlQuery";
import { IResponse } from "./interfaces/IResponse";
import getReqBody from "./modules/getBody";
import getRequestQuery from "./modules/getRequestQuery";
import parseUrlParam from "./modules/parseUrlParam";
import getRequestParam from "./modules/getRequestParam";

export default class Swiftlet {
  private host: string = "127.0.0.1";
  private port: number = 0;
  private debug: boolean = false;
  private acao: string = "*"; // Access-Control-Allow-Origin
  private routes: Array<IRoute> = [];

  constructor(
    port: number | string = 8080,
    acao?: string,
    host?: string,
    debug?: boolean
  ) {
    this.port = typeof port == "string" ? parseInt(port) : port;
    this.host = host ? host : this.host;
    this.debug = debug ? debug : this.debug;
    this.acao = acao ? acao : this.acao;
    this.start();
  }

  private server: Server = http.createServer(
    (req: IncomingMessage, res: ServerResponse): void => {
      let responseSent = false;
      let url: string = req.url ? req.url.split("?")[0] : "/";

      for (let route_ of this.routes) {
        const route: IRoute = route_;
        const endpoint: string = route.endpoint;

        // Regular expression to handle dynamic parameters
        const routeRegex = new RegExp(
          `^${endpoint.replace(/:[^\s/]+/g, "([\\w-]+)")}$`
        );
        const match = url.match(routeRegex);

        // Check if the URL matches the route and method
        if (match && req.method === route.method.toUpperCase()) {
          const haveQuery: boolean = req.url?.split("?")[1] ? true : false;
          const query: QueryTupleArray = haveQuery
            ? parseUrlQuery(req.url ? req.url.split("?")[1] : "")
            : undefined;
          const param: ParamTupleArray = match
            ? parseUrlParam(req.url ? req.url : "", route.endpoint)
            : undefined;

          getReqBody(req, (body: any) => {
            const searchRequest: IRequest = {
              query: (idx: string): string | undefined =>
                haveQuery ? getRequestQuery(idx, query) : undefined,
              param: (idx: string): string | undefined =>
                param ? getRequestParam(idx, param) : undefined,
              body: body,
            };

            const routeRes: IResponse = route.response(searchRequest);

            res.writeHead(routeRes.statusCode, {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": this.acao,
              Vary: "Origin",
            });

            if (this.acao === "*" || this.acao === req.headers.host) {
              if (this.debug)
                debugLog([
                  `REQUEST [${new Date().toLocaleString()}]:`,
                  req.method,
                  routeRes.statusCode,
                  `http://${this.host}:${this.port}${req.url}`,
                ]);

              // write json response
              res.write(JSON.stringify(routeRes.json));
            } else {
              req.connection.destroy();
            }

            res.end();
            responseSent = true;
          });
          return;
        }
      }

      if (!responseSent) {
        setTimeout(() => {
          if (this.debug)
            debugLog([
              `REQUEST [${new Date().toLocaleString()}]:`,
              req.method,
              404,
              `http://${this.host}:${this.port}${req.url}`,
            ]);
          res.end(`Invalid route: ${req.method} 404 ${url}`);
        }, 0.5);

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
