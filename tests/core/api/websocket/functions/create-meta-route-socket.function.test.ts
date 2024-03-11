import {
  MetaRouteEvent,
  MetaRouteSocketState,
  createMetaRouteSocket,
} from "@core/api";
import { MetaRouteEventSender } from "@core/api/websocket/metaroute-event-sender.socket";
import { MetaRouteNamespace } from "@core/api/websocket/metaroute-namespace.socket";
import crypto from "crypto";
import internal from "stream";

class MockDuplex extends internal.Duplex {
  data: Buffer | undefined;

  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    this.data = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    callback();
  }

  _read(size: number): void {
    // Not implemented as it's not needed for the tests
  }
}

describe("createMetaRouteSocket", () => {
  let socket: MockDuplex;
  let sender: MetaRouteEventSender;

  beforeEach(() => {
    socket = new MockDuplex();
    socket.data = undefined;
    sender = new MetaRouteEventSender();
  });

  it("should create a MetaRouteSocket with initial values", () => {
    const metaRouteSocket = createMetaRouteSocket(socket, sender);

    expect(metaRouteSocket.id).toBeDefined();
    expect(metaRouteSocket.event).toBeNull();
    expect(metaRouteSocket.namespaces).toBeInstanceOf(Map);
    expect(metaRouteSocket.state).toBe(MetaRouteSocketState.CONNECTING);
  });

  it("should set the response headers correctly", () => {
    const metaRouteSocket = createMetaRouteSocket(socket, sender);

    const key = "some-key";
    const expectedHash = crypto
      .createHash("sha1")
      .update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", "binary")
      .digest("base64");

    const expectedResponseHeaders =
      [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${expectedHash}`,
      ].join("\r\n") + "\r\n\r\n";

    metaRouteSocket.writeResponseHeaders(key);

    expect(socket.data?.toString()).toBe(expectedResponseHeaders);
  });

  it("should join a namespace correctly", () => {
    const metaRouteSocket = createMetaRouteSocket(socket, sender);
    const namespace = new MetaRouteNamespace("test-namespace");

    metaRouteSocket.join(namespace);

    expect(metaRouteSocket.namespaces.get(namespace.name)).toBe(namespace);
    expect(namespace.has(metaRouteSocket)).toBe(true);
  });

  it("should leave a namespace correctly", () => {
    const metaRouteSocket = createMetaRouteSocket(socket, sender);
    const namespace = new MetaRouteNamespace("test-namespace");
    metaRouteSocket.join(namespace);

    metaRouteSocket.leave(namespace);

    expect(metaRouteSocket.namespaces.get(namespace.name)).toBeUndefined();
    expect(namespace.has(metaRouteSocket)).toBe(false);
  });

  it("should send data correctly", () => {
    const metaRouteSocket = createMetaRouteSocket(socket, sender);
    const data = {
      event: "test-event",
      data: {
        message: "Hello, world!",
      },
    } as MetaRouteEvent;

    metaRouteSocket.state = MetaRouteSocketState.OPEN;
    metaRouteSocket.send(data);

    const expectedFramedData = sender.frame(data);

    expect(socket.data).toStrictEqual(expectedFramedData);
  });

  it("should not send data if WebSocket is not open", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const metaRouteSocket = createMetaRouteSocket(socket, sender);
    const data = {
      event: "test-event",
      data: {
        message: "Hello, world!",
      },
    } as MetaRouteEvent;

    metaRouteSocket.state = MetaRouteSocketState.CLOSED;
    metaRouteSocket.send(data);

    expect(socket.data).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      "Cannot send data because WebSocket is not open"
    );

    warnSpy.mockRestore();
  });
});
