import { SmtpOptions } from "@core/email/interfaces/smtp-options.interface";

export interface IEmailService<T> {
  send(email: T, smtpOptions: SmtpOptions): Promise<boolean>;
}
