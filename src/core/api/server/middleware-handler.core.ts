import { MetaRouteResponse, MetaRouteRequest } from "./interfaces";
import {
  ErrorMiddleware,
  Middleware,
  NextFunction,
  UnifiedMiddleware,
} from "../types";
import { Scope } from "../../common/enums/scope.enum";
import { Injectable } from "../../common/decorators/injectable.decorator";
import { ConsoleLogger } from "../../common/services/console-logger.service";

@Injectable({ scope: Scope.SINGLETON })
export class MiddlewareHandler {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(MiddlewareHandler.name);
  }

  private globalMiddleware: Middleware[] | ErrorMiddleware[] = [];

  async handle(
    middlewareList: Middleware[] | ErrorMiddleware[],
    req: MetaRouteRequest,
    res: MetaRouteResponse,
    next: NextFunction,
    error?: Error
  ) {
    if (middlewareList.length === 0) {
      next();
      return;
    }

    const flatMiddlewareList = middlewareList.flat();
    let i = 0;
    const nextMiddleware = this.createNextMiddleware(
      flatMiddlewareList,
      req,
      res,
      next,
      i
    );

    await nextMiddleware(error);
  }

  private createNextMiddleware(
    middlewareList: (Middleware | ErrorMiddleware)[],
    req: MetaRouteRequest,
    res: MetaRouteResponse,
    next: NextFunction,
    i: number,
    _error?: Error
  ): (err?: Error) => Promise<void> {
    return async (err?: Error) => {
      if (i < middlewareList.length) {
        const middleware = middlewareList[i++];
        const nextMiddleware = this.createNextMiddleware(
          middlewareList,
          req,
          res,
          next,
          i,
          err
        );

        if (err && this.isErrorMiddleware(middleware)) {
          this.logger.error(err.message);
          await middleware(err, req, res, nextMiddleware);
        } else if (this.isMiddleware(middleware)) {
          try {
            await middleware(req, res, nextMiddleware);
          } catch (error: any) {
            await nextMiddleware(error);
          }
        } else {
          await nextMiddleware(err);
        }
      } else {
        await next(err);
      }
    };
  }

  private isErrorMiddleware(middleware: any): middleware is ErrorMiddleware {
    return typeof middleware === "function" && middleware.length === 4;
  }

  private isMiddleware(middleware: any): middleware is Middleware {
    return typeof middleware === "function";
  }

  get middleware() {
    return this.globalMiddleware;
  }

  public use(middleware: UnifiedMiddleware) {
    this.globalMiddleware.push(middleware);
  }
}
