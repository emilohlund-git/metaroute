import "reflect-metadata";
import {
  Get,
  Post,
  Put,
  Patch,
  Delete,
} from "@core/api/decorators/handlers.decorator";
import { ROUTE_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";
import TestClass from "tests/utils/test-class.util";

describe("Route decorators", () => {
  it.each([
    ["get", Get, "getMethod", "/get"],
    ["post", Post, "postMethod", "/post"],
    ["put", Put, "putMethod", "/put"],
    ["patch", Patch, "patchMethod", "/patch"],
    ["delete", Delete, "deleteMethod", "/delete"],
  ])(
    "should set metadata for a %s method",
    (method, decorator, methodName, path) => {
      const metadata = Reflect.getMetadata(
        ROUTE_METADATA_KEY,
        TestClass.prototype[methodName as keyof TestClass]
      );
      expect(metadata).toEqual({
        method,
        path,
        middleware: undefined,
      });
    }
  );
});
