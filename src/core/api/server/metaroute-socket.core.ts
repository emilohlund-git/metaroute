import { Injectable } from "../../common/decorators/injectable.decorator";
import { Scope } from "../../common/enums/scope.enum";
import EventEmitter from "events";
import * as http from "http";
import internal from "stream";
import { MetaRouteSocketHandler } from "./metaroute-socket-handler.core";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteSocketServer extends EventEmitter {
  public namespaces: { [key: string]: EventEmitter } = {};

  constructor(private handler: MetaRouteSocketHandler) {
    super();
  }

  of(namespacePath: string): EventEmitter {
    if (!this.namespaces[namespacePath]) {
      this.namespaces[namespacePath] = new EventEmitter();
    }
    return this.namespaces[namespacePath];
  }

  handleUpgrade(
    request: http.IncomingMessage,
    socket: internal.Duplex,
    head: Buffer
  ) {
    const metaRouteSocket = this.handler.handleUpgrade(request, socket, head);

    const namespacePath = request.url || "/";
    const namespace = this.of(namespacePath);
    namespace.emit("connection", metaRouteSocket);

    metaRouteSocket.on("end", () => {
      this.emit("close");
      namespace.emit("disconnect", metaRouteSocket);
    });
  }
}
