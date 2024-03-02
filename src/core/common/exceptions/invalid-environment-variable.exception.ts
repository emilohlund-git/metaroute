import { MetaRouteException } from "./meta-route.exception";

export class EnvironmentVariableException extends MetaRouteException {
  constructor(message: string) {
    super(message);
    this.name = "EnvironmentVariableException";
  }
}
