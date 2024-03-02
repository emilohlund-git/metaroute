import { EventRouter } from "@core/api/server/routing/event.router";
import { ON_MESSAGE_METADATA_KEY, SOCKETIO_SERVER_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { Controller } from "@core/common/interfaces/controller.interface";
import "reflect-metadata";

import { Server as SocketServer, Socket, Server } from "socket.io";

jest.mock("socket.io");

describe("EventRouter", () => {
  let io: jest.Mocked<Server<SocketServer>> & { of: jest.Mock };
  let controller: Partial<Controller>;
  let socket: Partial<Socket> & { on: jest.Mock; emit: jest.Mock };
  let eventRouter: EventRouter<Controller>;

  beforeEach(() => {
    io = {
      of: jest.fn(),
    } as jest.Mocked<Server<SocketServer>> & { of: jest.Mock };
    controller = {
      constructor: function () {},
    };
    socket = {
      on: jest.fn(),
      emit: jest.fn(),
    };
    eventRouter = new EventRouter();

    Reflect.defineMetadata(
      SOCKETIO_SERVER_METADATA_KEY,
      "/test",
      Object.getPrototypeOf(controller)
    );
    Reflect.defineMetadata(
      ON_MESSAGE_METADATA_KEY,
      [{ key: "test", metadata: "test" }],
      Object.getPrototypeOf(controller)
    );

    (io.of as jest.Mock).mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === "connection") {
          callback(socket);
        }
      }),
    });
  });

  it("should register events", () => {
    eventRouter.register(io as SocketServer, controller as Controller);

    expect(io.of).toHaveBeenCalledWith("/test");
    expect(socket.on).toHaveBeenCalledWith(
      [{ key: "test", metadata: "test" }],
      expect.any(Function)
    );
  });

  it("should emit event with result", async () => {
    controller.test = jest.fn().mockResolvedValue("result");

    eventRouter.register(io as SocketServer, controller as Controller);

    // Call the socket event callback
    const socketCallback = socket.on.mock.calls[0][1];
    await socketCallback("data");

    expect(socket.emit).toHaveBeenCalledWith(
      [{ key: "test", metadata: "test" }],
      undefined
    );
  });

  it("should register multiple events", () => {
    Reflect.defineMetadata(
      ON_MESSAGE_METADATA_KEY,
      [
        { key: "test1", metadata: "test1" },
        { key: "test2", metadata: "test2" },
      ],
      Object.getPrototypeOf(controller)
    );

    eventRouter.register(io as SocketServer, controller as Controller);

    expect(socket.on).toHaveBeenCalledWith(
      [
        { key: "test1", metadata: "test1" },
        { key: "test2", metadata: "test2" },
      ],
      expect.any(Function)
    );
  });

  it("should use different namespaces", () => {
    Reflect.defineMetadata(
      SOCKETIO_SERVER_METADATA_KEY,
      "/different",
      Object.getPrototypeOf(controller)
    );

    eventRouter.register(io as SocketServer, controller as Controller);

    expect(io.of).toHaveBeenCalledWith("/different");
  });
});
