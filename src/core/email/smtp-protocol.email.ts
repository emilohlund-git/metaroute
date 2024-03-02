import * as tls from "tls";
import { SmtpOptions } from "./interfaces/smtp-options.interface";
import { SmtpCommands } from "./constants/smtp.constants";
import { SmtpHandler } from "./types";
import { SmtpCodes } from "./enums/smtp-codes.enum";
import { Email } from "./entities/email.entity";
import { ConsoleLogger } from "../common/services/console-logger.service";

export abstract class SmtpProtocol {
  protected readonly logger = new ConsoleLogger(SmtpProtocol.name);
  protected options: tls.ConnectionOptions;
  protected user: string;
  protected password: string;

  protected handlers: SmtpHandler = {
    [SmtpCodes.GREETING]: (client: tls.TLSSocket) => {
      client.write(
        `${SmtpCommands.AUTH_LOGIN} ${Buffer.from(this.user).toString(
          "base64"
        )}\r\n`
      );
    },
    [SmtpCodes.AUTH_LOGIN]: (client: tls.TLSSocket) => {
      client.write(`${Buffer.from(this.password).toString("base64")}\r\n`);
    },
    [SmtpCodes.AUTH_SUCCESS]: (client: tls.TLSSocket) => {
      client.write(`${SmtpCommands.MAIL_FROM}<${this.user}>\r\n`);
    },
    [SmtpCodes.MAIL_FROM_SUCCESS]: (
      client: tls.TLSSocket,
      email: Email,
      secondaryCode: string
    ) => {
      if (secondaryCode === "2.1.0") {
        client.write(`${SmtpCommands.RCPT_TO}<${email.to}>\r\n`);
      } else if (secondaryCode === "2.1.5") {
        client.write(`${SmtpCommands.DATA}`);
      }
    },
    [SmtpCodes.DATA_SUCCESS]: (client: tls.TLSSocket, email: Email) => {
      client.write(
        `Subject: ${email.subject}\r\n` +
          `Content-Type: text/html; charset="UTF-8"\r\n\r\n` +
          `${email.body}\r\n.\r\n`
      );
      client.write(`${SmtpCommands.QUIT}`);
    },
    [SmtpCodes.MAILBOX_UNAVAILABLE]: (client: tls.TLSSocket) => {
      this.logger.warn(`Mailbox unavailable`);
      client.end();
    },
    [SmtpCodes.BYE]: (client: tls.TLSSocket) => {
      client.end();
    },
  };

  constructor(smtpOptions: SmtpOptions) {
    this.options = {
      host: smtpOptions.host,
      port: smtpOptions.port,
    };
    this.user = smtpOptions.user;
    this.password = smtpOptions.password;
  }

  protected abstract connectToServer(): Promise<tls.TLSSocket>;
  protected abstract listenToClient(client: tls.TLSSocket, email: Email): void;
  protected abstract handleResponse(
    client: tls.TLSSocket,
    response: string,
    email: Email
  ): Promise<void>;
}
