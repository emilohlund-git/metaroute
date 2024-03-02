export class MetaRouteException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MetaRouteException";
  }
}
