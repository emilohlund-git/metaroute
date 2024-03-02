export class ParserException extends Error {
  constructor(message: string) {
    super(`[Parser] - ${message}`);
    this.name = "ParserException";
  }
}
