export class InvalidTokenFormatException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTokenFormatException";
  }
}
