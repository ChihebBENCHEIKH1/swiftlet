import http, { Server, IncomingMessage, ServerResponse } from "http";
import debugLog from "./modules/debugLog";
import { IRoute } from "./interfaces/IRoute";
import { IRequest } from "./interfaces/IRequest";

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
      let responseSent = false; // Flag to track if a response has been sent

      for (let route of this.routes) {
        if (req.url === route.endpoint) {
          const searchRequest: IRequest = {
            query: [""],
            param: [""],
          };

          route.callback ? route.callback(searchRequest) : null;
          if (this.debug)
            debugLog([
              `REQUEST [${new Date().toLocaleString()}]:`,
              route.method.toUpperCase(),
              `http://${this.host}:${this.port}${req.url}`,
            ]);

          res.writeHead(route.res.statusCode, {
            "Content-Type": "application/json",
          });
          res.write(JSON.stringify(route.res.json));

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
