import Swiftlet from "../Swiftlet";

const server: Swiftlet = new Swiftlet(1939, undefined, true);

server.route({
  endpoint: "/",
  method: "GET",
  response: (req: any) => {
    return {
      statusCode: 200,
      json: {
        testing: "Hello World",
        query: req.query("query"),
        date: new Date().toLocaleString(),
      },
    };
  },
});

server.route({
  endpoint: "/test",
  method: "GET",
  response: (req: any) => {
    return {
      statusCode: 200,
      json: {
        testing: "json",
        query: req.query("query"),
        date: new Date().toLocaleString(),
      },
    };
  },
});
