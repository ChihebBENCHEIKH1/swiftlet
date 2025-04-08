import { IncomingMessage } from "http";

export default function getRequestBody(
  req: IncomingMessage,
  callback: Function
): void {
  if (req.method !== "GET") {
    req.on("data", (chunk: Buffer): void => {
      if (chunk.length > 1e6) req.connection.destroy();

      const body: string = chunk.toString();

      return callback(JSON.parse(body));
    });
  } else {
    return callback(undefined);
  }

  return;
}
