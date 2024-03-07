import { Injectable } from "../../common/decorators/injectable.decorator";
import { Scope } from "../../common/enums/scope.enum";
import { MetaRouteEvent } from "./interfaces";

@Injectable({ scope: Scope.SINGLETON })
export class MetaRouteEventSender {
  frame(data: MetaRouteEvent): Buffer {
    const dataString = JSON.stringify(data);
    const payload = Buffer.from(dataString);
    const length = payload.length;

    let buffer;
    if (length <= 125) {
      buffer = Buffer.alloc(length + 2);
      buffer[1] = length;
    } else if (length <= 0xffff) {
      buffer = Buffer.alloc(length + 4);
      buffer[1] = 126;
      buffer.writeUInt16BE(length, 2);
    } else {
      buffer = Buffer.alloc(length + 10);
      buffer[1] = 127;
      buffer.writeBigUInt64BE(BigInt(length), 2);
    }

    buffer[0] = 0x81; // Set FIN bit and text opcode

    payload.copy(buffer, buffer.length - length); // Copy payload into buffer

    return buffer;
  }
}
