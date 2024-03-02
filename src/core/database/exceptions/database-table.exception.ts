export class DatabaseTableException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseTableException";
  }
}
