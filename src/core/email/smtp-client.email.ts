import * as tls from "tls";
import { EmailParseException } from "./exceptions/email-parse.exception";
import { SmtpCommands } from "./constants/smtp.constants";
import { SmtpOptions } from "./interfaces/smtp-options.interface";
import { SmtpProtocol } from "./smtp-protocol.email";
import { Email } from "./entities/email.entity";

export class SmtpClient extends SmtpProtocol {
  constructor(smtpOptions: SmtpOptions) {
    super(smtpOptions);
  }

  async send(email: Email): Promise<boolean> {
    this.logger.debug(`Sending email to: ${email.to}`);
    try {
      const client = await this.connectToServer();
      await this.listenToClient(client, email);
      return true;
    } catch (error: any) {
      this.logger.error(`Error sending email: ${error.message}`);
      return false;
    }
  }

  protected connectToServer(): Promise<tls.TLSSocket> {
    return new Promise((resolve, reject) => {
      const client = tls.connect(this.options, () => {
        client.write(`${SmtpCommands.HELO}`);
        resolve(client);
      });
      client.on("error", reject);
    });
  }

  protected async listenToClient(client: tls.TLSSocket, email: Email) {
    client.on("data", async (data) => {
      this.logger.debug(`Received data: ${data}`);
      try {
        await this.handleResponse(client, data.toString(), email);
      } catch (error: any) {
        this.logger.error(`Error handling response: ${error.message}`);
        client.end();
      }
    });
    client.on("end", () => this.logger.debug(`Connection ended`));
  }

  protected async handleResponse(
    client: tls.TLSSocket,
    response: string,
    email: Email
  ) {
    this.logger.debug(`Handling response: ${response}`);

    const [primaryCode, secondaryCode] = this.parseEmailResponse(response);

    const handler = this.handlers[primaryCode];
    if (handler) {
      this.logger.debug(`Found handler for response code: ${primaryCode}`);
      handler(client, email, secondaryCode);
    } else {
      throw new EmailParseException(
        `Unhandled response code: ${primaryCode}. Response: ${response}`
      );
    }
  }

  private parseEmailResponse(response: string) {
    const responseMatch = response.match(/^(\d{3})(?: (\d+\.\d+\.\d+))?/);
    if (!responseMatch) {
      throw new EmailParseException(
        `Could not parse response: ${response}. Expected format: XXX Y.Y.Y`
      );
    }

    const primaryCode = responseMatch[1];
    const secondaryCode = responseMatch[2] || "";

    return [primaryCode, secondaryCode];
  }
}
