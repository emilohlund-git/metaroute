import { IncomingMessage, Server, ServerResponse } from "http";
import { MetaRouteCore } from "../metaroute.core";
import { AppConfiguration } from "./app-configuration.interface";

/**
 * Represents a server application.
 */
export abstract class Application {
  /**
   * The application configuration.
   */
  private readonly appConfig: AppConfiguration;

  /**
   * The HTTP server instance.
   */
  private readonly _server: Server<
    typeof IncomingMessage,
    typeof ServerResponse
  >;

  /**
   * The MetaRouteCore instance.
   */
  protected readonly core: MetaRouteCore;

  constructor(core: MetaRouteCore) {
    this.core = core;
  }

  /**
   * Starts the server.
   */
  public start(): void {
    this.core.setup(this.appConfig);
  }

  /**
   * Stops the server.
   */
  public stop(): void {
    this.server.close();
  }

  get server(): Server<typeof IncomingMessage, typeof ServerResponse> {
    return this._server;
  }
}
