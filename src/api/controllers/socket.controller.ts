import { OnMessage } from "@core/api/decorators/on-message.decorator";
import { SocketServer } from "@core/api/decorators/socket.decorator";

@SocketServer("test")
export class SocketController {
  @OnMessage("test")
  async test(client: any, data: any) {
    return data;
  }
}
