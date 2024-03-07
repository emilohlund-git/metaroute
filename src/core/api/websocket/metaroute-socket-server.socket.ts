import { Injectable } from "../../common/decorators/injectable.decorator";
import { Scope } from "../../common/enums/scope.enum";
import EventEmitter from "events";
import * as http from "http";
import internal from "stream";
import { MetaRouteEventReceiver } from "./metaroute-event-receiver.socket";
import { MetaRouteNamespace } from "./metaroute-namespace.socket";
import { MetaRouteSocket } from "./interfaces";
import { createMetaRouteSocket } from "./functions";
import { MetaRouteEventSender } from "./metaroute-event-sender.socket";
import { MetaRouteSocketState } from "./enums";

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

    this.setupEventListener(metaRouteSocket, namespace);
    // Space for future setup and configurations

    metaRouteSocket.emit("open");
  }

  setupEventListener(socket: MetaRouteSocket, namespace: MetaRouteNamespace) {
    try {
      socket.on("open", () => {
        socket.state = MetaRouteSocketState.OPEN;
      });

      socket.on("close", () => {
        socket.state = MetaRouteSocketState.CLOSING;
      });

      socket.on("end", () => {
        socket.state = MetaRouteSocketState.CLOSED;
        socket.leave(namespace);
        socket.end();
      });

      socket.on("data", (raw) => {
        const data = this.receiver.frame(raw);
        if (data) {
          if (data.event === "close") socket.emit("close");
          socket.emit(data.event, data.data);
        }
      });
    } catch (error) {
      socket.emit("end");
    }
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
