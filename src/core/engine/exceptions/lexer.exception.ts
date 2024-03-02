export class LexerException extends Error {
  constructor(message: string) {
    super(`[Lexer] - ${message}`);
    this.name = "LexerException";
  }
}
