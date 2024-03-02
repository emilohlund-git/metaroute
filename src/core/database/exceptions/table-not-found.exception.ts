export class TableNotFoundException extends Error {
    constructor(message: string) {
      super(message);
      this.name = "TableNotFoundException";
    }
  }
  