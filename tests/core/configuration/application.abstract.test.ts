import { Server } from "http";
import { mock } from "ts-mockito";
import * as http from "http";
import { Application, MetaRouteCore } from "@core/configuration";

jest.mock("http", () => {
  return {
    Server: jest.fn().mockImplementation(() => {
      return {
        close: jest.fn(),
      };
    }),
  };
});

class TestApplication extends Application {
  get server(): Server {
    return super.server;
  }
}

describe("Application", () => {
  let app: Application;
  let core: MetaRouteCore;
  let server: Server;

  beforeEach(() => {
    server = { close: jest.fn() } as any;
    core = mock(MetaRouteCore);
    app = new TestApplication(core);

    Object.defineProperty(app, "server", {
      get: () => server,
    });
  });

  it("should start the server", () => {
    const spy = jest.spyOn(core, "setup");
    app.start();
    expect(spy).toHaveBeenCalled();
  });

  it("should stop the server", () => {
    app.stop();
    expect(server.close).toHaveBeenCalled();
  });

  it("should return the server", () => {
    expect(app.server).toBe(server);
  });
});
