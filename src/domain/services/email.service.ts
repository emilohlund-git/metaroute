import { Injectable } from "@core/common/decorators/injectable.decorator";
import { IEmailService } from "../interfaces/email-service.interface";
import { Email } from "@core/email/entities/email.entity";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { SmtpOptions } from "@core/email/interfaces/smtp-options.interface";
import { ConfigService } from "@core/common/services/config.service";
import { SmtpClient } from "@core/email/smtp-client.email";

@Injectable
export class EmailService implements IEmailService<Email> {
  private readonly logger = new ConsoleLogger(EmailService.name);
  private options: SmtpOptions;

  constructor(private readonly configService: ConfigService) {
    this.options = {
      host: this.configService.get("SMTP_HOST"),
      port: 465,
      user: this.configService.get("SMTP_USER"),
      password: this.configService.get("SMTP_PASSWORD"),
    };
  }

  async send(email: Email) {
    const smtpClient = new SmtpClient(this.options);
    try {
      const result = await smtpClient.send(email);
      return result;
    } catch (error: any) {
      this.logger.error(`Error sending email: ${error.message}`);
      return false;
    }
  }
}
