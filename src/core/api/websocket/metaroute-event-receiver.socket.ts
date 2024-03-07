import { MetaRouteFrameHandler } from "./metaroute-frame-handler.socket";
import { Injectable } from "../../common/decorators/injectable.decorator";
import { Scope } from "../../common/enums/scope.enum";
import { OpCode } from "../enums/op-codes";
import { MetaRouteEvent } from "./interfaces";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteEventReceiver {
  constructor(private handler: MetaRouteFrameHandler) {}

  private handlers: {
    [key in OpCode]?: (raw: Buffer) => MetaRouteEvent | void;
  } = {
    [OpCode.Text]: (raw) => {
      const framedData = this.handler.handleText(raw);
      return framedData;
    },
    [OpCode.Binary]: (raw) => {
      const binaryData = this.handler.handleBinary(raw);
      return binaryData;
    },
    [OpCode.Continuation]: (raw) => {
      this.handler.handleContinuation(raw);
    },
    [OpCode.Close]: () => {
      const closeData = this.close();
      return closeData;
    },
    [OpCode.Ping]: () => {
      const pingData = this.ping();
      return pingData;
    },
    [OpCode.Pong]: () => {
      const pongData = this.pong();
      return pongData;
    },
  };

  frame(raw: Buffer): MetaRouteEvent | void {
    const opCode = raw[0] & 0x0f;
    const handler = this.handlers[opCode as OpCode];
    if (handler) {
      return handler(raw);
    }
  }

  close() {
    return { event: "close", data: "" };
  }

  ping() {
    const pongFrame = Buffer.from([0x8a, 0x00]);
    return { event: "ping", data: pongFrame };
  }

  pong() {
    return { event: "pong", data: null };
  }
}
