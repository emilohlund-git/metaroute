import internal from "stream";
import { MetaRouteSocket } from "./interfaces/meta-route.socket";
import { MetaRouteFrameHandler } from "./metaroute-frame-handler.core";
import * as http from "http";
import { Injectable } from "../../common/decorators/injectable.decorator";
import { Scope } from "../../common/enums/scope.enum";
import { createMetaRouteSocket } from "./functions/create-meta-route-socket.function";
import { OpCode } from "../enums/op-codes";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteSocketHandler {
  constructor(private handler: MetaRouteFrameHandler) {}

  handleUpgrade(
    request: http.IncomingMessage,
    socket: internal.Duplex,
    head: Buffer
  ): MetaRouteSocket {
    const metaRouteSocket = createMetaRouteSocket(socket);
    metaRouteSocket.writeResponseHeaders(request.headers["sec-websocket-key"]);

    this.setupEventListener(metaRouteSocket);

    return metaRouteSocket;
  }

  setupEventListener(socket: MetaRouteSocket) {
    socket.on("data", (raw) => {
      const opcode = raw[0] & 0xf;
      switch (opcode) {
        case OpCode.Text:
          const { event, data } = this.handler.handleText(raw);
          socket.emit(event, data);
          break;
        case OpCode.Binary:
          this.handler.handleBinary(raw);
          break;
        case OpCode.Continuation:
          this.handler.handleContinuation(raw);
          break;
        case OpCode.Close:
          this.close(socket);
          break;
        case OpCode.Ping:
          this.ping(socket);
          break;
        case OpCode.Pong:
          this.pong(data);
          break;
      }
    });
  }

  close(socket: MetaRouteSocket) {
    socket.end();
  }

  ping(socket: MetaRouteSocket) {
    const pongFrame = Buffer.from([0x8a, 0x00]);
    socket.write(pongFrame);
  }

  pong(data: Buffer) {}
}
