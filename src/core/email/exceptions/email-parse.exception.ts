export class EmailParseException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailParseException";
  }
}
