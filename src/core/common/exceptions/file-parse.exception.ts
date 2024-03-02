import { MetaRouteException } from "./meta-route.exception";

export class FileParseException extends MetaRouteException {
  constructor(message: string) {
    super(message);
    this.name = "FileParseException";
  }
}
