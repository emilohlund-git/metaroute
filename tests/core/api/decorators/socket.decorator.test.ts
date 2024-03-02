import "reflect-metadata";

import { SocketServer } from "@core/api/decorators/socket.decorator";
import { SOCKETIO_SERVER_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import { MetaRoute } from "@core/common/meta-route.container";
import TestClass from "tests/utils/test-class.util";

jest.mock("@core/common/meta-route.container");

describe("SocketServer decorator", () => {
  it("should set metadata for a class and register it", () => {
    const namespace = "test";
    SocketServer(namespace)(TestClass);

    const metadata = Reflect.getMetadata(
      SOCKETIO_SERVER_METADATA_KEY,
      TestClass
    );
    expect(metadata).toBe(namespace);

    expect(MetaRoute.register).toHaveBeenCalledWith(TestClass);
  });
});
