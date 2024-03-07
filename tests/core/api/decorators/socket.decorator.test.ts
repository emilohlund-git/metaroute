import "reflect-metadata";

import { MetaRoute } from "@core/common/meta-route.container";
import TestClass from "tests/utils/test-class.util";
import { METAROUTE_SOCKET_SERVER_METADATA_KEY, SocketServer } from "src";

jest.mock("@core/common/meta-route.container");

describe("SocketServer decorator", () => {
  it("should set metadata for a class and register it", () => {
    const namespace = "test";
    SocketServer(namespace)(TestClass);

    const metadata = Reflect.getMetadata(
      METAROUTE_SOCKET_SERVER_METADATA_KEY,
      TestClass
    );
    expect(metadata).toBe(namespace);

    expect(MetaRoute.register).toHaveBeenCalledWith(TestClass);
  });
});
