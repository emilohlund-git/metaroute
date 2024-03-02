export class TableCreationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TableCreationException";
  }
}
