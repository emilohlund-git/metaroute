import crypto, { randomUUID } from "crypto";
import internal from "stream";
import { MetaRouteSocket } from "../interfaces/meta-route.socket";
import { MetaRouteNamespace } from "../metaroute-namespace.socket";
import { MetaRouteEvent } from "../interfaces/metaroute-event.interface";
import { MetaRouteEventSender } from "../metaroute-event-sender.socket";
import { MetaRouteSocketState } from "../enums";

export function createMetaRouteSocket(
  socket: internal.Duplex,
  sender: MetaRouteEventSender
) {
  const metaRouteSocket = socket as MetaRouteSocket;

  metaRouteSocket.id = randomUUID();
  metaRouteSocket.event = null;
  metaRouteSocket.namespaces = new Map();
  metaRouteSocket.state = MetaRouteSocketState.CONNECTING;

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

  metaRouteSocket.join = function (namespace: MetaRouteNamespace) {
    namespace.add(metaRouteSocket);
    this.namespaces.set(namespace.name, namespace);
  };

  metaRouteSocket.leave = function (namespace: MetaRouteNamespace) {
    this.namespaces.delete(namespace.name);
    namespace.remove(metaRouteSocket);
  };

  metaRouteSocket.send = function (data: MetaRouteEvent) {
    if (this.state !== MetaRouteSocketState.OPEN) {
      console.warn("Cannot send data because WebSocket is not open");
      return;
    }
    const framedData = sender.frame(data);
    this.write(framedData);
  };

  return metaRouteSocket;
}
