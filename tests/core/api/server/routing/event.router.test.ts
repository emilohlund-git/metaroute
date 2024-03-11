import "reflect-metadata";

import {
  METAROUTE_SOCKET_SERVER_METADATA_KEY,
  ON_MESSAGE_METADATA_KEY,
} from "@common/constants";
import { ConsoleLogger } from "@common/services";
import {
  EventRouter,
  MetaRouteSocket,
  MetaRouteSocketServer,
} from "@api/websocket";

describe("EventRouter", () => {
  let logger: ConsoleLogger;
  let io: MetaRouteSocketServer;
  let controller: Partial<any>;
  let socket: MetaRouteSocket;
  let eventRouter: EventRouter<any>;

  beforeEach(() => {
    io = {
      namespace: jest.fn(),
    } as jest.Mocked<MetaRouteSocketServer> & { namespace: jest.Mock };
    controller = {
      constructor: function () {},
    };
    socket = {
      on: jest.fn(),
      emit: jest.fn(),
    } as any as MetaRouteSocket;
    logger = new ConsoleLogger("TEST");
    eventRouter = new EventRouter(logger);

    Reflect.defineMetadata(
      METAROUTE_SOCKET_SERVER_METADATA_KEY,
      "/test",
      Object.getPrototypeOf(controller)
    );
    Reflect.defineMetadata(
      ON_MESSAGE_METADATA_KEY,
      [{ key: "test", metadata: "test" }],
      Object.getPrototypeOf(controller)
    );

    (io.namespace as jest.Mock).mockReturnValue({
      on: jest.fn((event, callback) => {
        if (event === "connection") {
          callback(socket);
        }
      }),
    });
  });

  it("should register events", () => {
    eventRouter.register(io, controller);

    expect(io.namespace).toHaveBeenCalledWith("/test");
    expect(socket.on).toHaveBeenCalledWith(
      [{ key: "test", metadata: "test" }],
      expect.any(Function)
    );
  });

  it("should use different namespaces", () => {
    Reflect.defineMetadata(
      METAROUTE_SOCKET_SERVER_METADATA_KEY,
      "/different",
      Object.getPrototypeOf(controller)
    );

    eventRouter.register(io, controller);

    expect(io.namespace).toHaveBeenCalledWith("/different");
  });
});
