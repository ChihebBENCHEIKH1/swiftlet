import Swiftlet from "../Swiftlet";

const server: Swiftlet = new Swiftlet(1939, undefined, true);

server.route({
  endpoint: "/",
  method: "get",
  callback: () => console.log("ping pong!"),
  res: {
    statusCode: 201,
    json: {
      ping: "pong!",
    },
  },
});

server.route({
  endpoint: "/test",
  method: "get",
  callback: () => console.log("hello world!"),
  res: {
    statusCode: 201,
    json: {
      hello: "world!",
    },
  },
});
