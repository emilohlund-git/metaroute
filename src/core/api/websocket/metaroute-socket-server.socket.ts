import { Injectable } from "../../common/decorators/injectable.decorator";
import { Scope } from "../../common/enums/scope.enum";
import EventEmitter from "events";
import * as http from "http";
import internal from "stream";
import { MetaRouteEventReceiver } from "./metaroute-event-receiver.socket";
import { MetaRouteNamespace } from "./metaroute-namespace.socket";
import { MetaRouteSocket } from "./interfaces/meta-route.socket";
import { MetaRouteEventSender } from "./metaroute-event-sender.socket";
import { MetaRouteSocketState } from "./enums/metaroute-socket-state.enum";
import { createMetaRouteSocket } from "./functions/create-meta-route-socket.function";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteSocketServer extends EventEmitter {
  public namespaces: MetaRouteNamespace[] = [];

  constructor(
    private receiver: MetaRouteEventReceiver,
    private sender: MetaRouteEventSender
  ) {
    super();
  }

  namespace(namespacePath: string): MetaRouteNamespace {
    const existingNamespace = this.namespaces.find(
      (ns) => ns.name === namespacePath
    );
    if (!existingNamespace) {
      const namespace = new MetaRouteNamespace(namespacePath);
      this.namespaces.push(namespace);
      return namespace;
    }
    return existingNamespace;
  }

  connect(
    request: http.IncomingMessage,
    socket: internal.Duplex,
    head: Buffer
  ) {
    const metaRouteSocket = this.upgrade(request, socket, head);

    const namespacePath = request.url || "/";
    const namespace = this.namespace(namespacePath);
    metaRouteSocket.join(namespace);

    metaRouteSocket.on("open", () => {
      metaRouteSocket.state = MetaRouteSocketState.OPEN;
    });

    metaRouteSocket.on("close", () => {
      metaRouteSocket.state = MetaRouteSocketState.CLOSING;
    });

    metaRouteSocket.on("end", () => {
      metaRouteSocket.state = MetaRouteSocketState.CLOSED;
      metaRouteSocket.leave(namespace);
      metaRouteSocket.end();
    });

    metaRouteSocket.on("data", (raw) => {
      const data = this.receiver.frame(raw);
      if (data) {
        if (data.event === "close") metaRouteSocket.emit("close");
        metaRouteSocket.emit(data.event, data.data);
      }
    });

    metaRouteSocket.emit("open");
  }

  upgrade(
    request: http.IncomingMessage,
    socket: internal.Duplex,
    head: Buffer
  ): MetaRouteSocket {
    const metaRouteSocket = createMetaRouteSocket(socket, this.sender);
    metaRouteSocket.writeResponseHeaders(request.headers["sec-websocket-key"]);

    return metaRouteSocket;
  }
}
