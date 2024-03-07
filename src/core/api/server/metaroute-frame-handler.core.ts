import { Injectable } from "../../common/decorators/injectable.decorator";
import { Scope } from "../../common/enums/scope.enum";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteFrameHandler {
  private buffer: Buffer;

  constructor() {
    this.buffer = Buffer.alloc(0);
  }

  handle(raw: Buffer, messageType: string): { event: string; data: any } {
    try {
      let length = raw[1] & 0x7f;
      let maskStart = 2;
      if (length === 126) {
        length = raw.readUInt16BE(2);
        maskStart = 4;
      } else if (length === 127) {
        length = raw.readUInt32BE(2) * Math.pow(2, 32) + raw.readUInt32BE(6);
        maskStart = 10;
      }

      const mask = raw.subarray(maskStart, maskStart + 4);
      const payload = raw.subarray(maskStart + 4, maskStart + 4 + length);

      for (let i = 0; i < payload.length; i++) {
        payload[i] ^= mask[i % 4];
      }

      this.buffer = Buffer.concat([this.buffer, payload]);

      const message = JSON.parse(payload.toString());

      const { event, data } = message;

      return { event, data };
    } catch (error) {
      console.error(`Error handling ${messageType} frame: `, error);
      return { event: "", data: "" };
    }
  }

  handleText(data: Buffer): { event: string; data: any } {
    return this.handle(data, "message");
  }

  handleBinary(data: Buffer): { event: string; data: any } {
    return this.handle(data, "binary");
  }

  handleContinuation(data: Buffer): { event: string; data: any } {
    return this.handle(data, "continuation");
  }
}
