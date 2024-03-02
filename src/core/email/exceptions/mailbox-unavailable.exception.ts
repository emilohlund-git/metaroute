export class MailboxUnavailableException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MailboxUnavailableException";
  }
}
