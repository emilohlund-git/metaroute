import crypto, { randomUUID } from "crypto";
import internal from "stream";
import { MetaRouteSocket } from "../interfaces/meta-route.socket";

export function createMetaRouteSocket(socket: internal.Duplex) {
  const metaRouteSocket = socket as MetaRouteSocket;

  metaRouteSocket.id = randomUUID();

  metaRouteSocket.writeResponseHeaders = function (key?: string) {
    const hash = crypto
      .createHash("sha1")
      .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", "binary")
      .digest("base64");

    const responseHeaders = [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${hash}`,
    ];

    metaRouteSocket.write(responseHeaders.join("\r\n") + "\r\n\r\n");
  };

  return metaRouteSocket;
}
