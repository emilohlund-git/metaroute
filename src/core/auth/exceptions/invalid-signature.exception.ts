export class InvalidSignatureException extends Error {
    constructor(message: string) {
      super(message);
      this.name = "InvalidSignatureException";
    }
  }
  