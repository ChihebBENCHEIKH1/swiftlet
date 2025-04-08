import { IRequest } from "../interfaces/IRequest";
import { IResponse } from "../interfaces/IResponse";
import Swiftlet from "../Swiftlet";

const server: Swiftlet = new Swiftlet(1939, "*", undefined, true);

server.route({
  endpoint: "/",
  method: "GET",
  response: (request: IRequest): IResponse => {
    return {
      statusCode: 200,
      json: {
        testing: "Hello World",
        query: request.query("query"),
        date: new Date().toLocaleString(),
      },
    };
  },
});

server.route({
  endpoint: "/test",
  method: "GET",
  response: (request: IRequest): IResponse => {
    return {
      statusCode: 200,
      json: {
        testing: "json",
        query: request.query("query"),
        date: new Date().toLocaleString(),
      },
    };
  },
});

server.route({
  endpoint: "/body",
  method: "POST",
  response: (req: IRequest): IResponse => {
    return {
      statusCode: 200,
      json: {
        body: req.body,
      },
    };
  },
});

server.route({
  endpoint: "/param/:username/:id",
  method: "GET",
  response: (request: IRequest): IResponse => {
    return {
      statusCode: 200,
      json: {
        test: "test",
        usernameParam: request.param("username"),
        idParam: request.param("id"),
      },
    };
  },
});
