import "reflect-metadata";
import { SmtpOptions, SmtpProtocol } from "@core/email";
import { Email } from "@email/entities";
import { SmtpCodes } from "@email/enums";
import * as tls from "tls";

class ConcreteSmtpProtocol extends SmtpProtocol {
  protected async connectToServer(): Promise<tls.TLSSocket> {
    return {} as tls.TLSSocket;
  }

  protected listenToClient(client: tls.TLSSocket, email: Email): void {}

  protected async handleResponse(
    client: tls.TLSSocket,
    response: string,
    email: Email
  ): Promise<void> {}
}

describe("SmtpProtocol", () => {
  let smtpProtocol: ConcreteSmtpProtocol;
  let smtpOptions: SmtpOptions;
  let mockSocket: tls.TLSSocket;
  let mockEmail: Email;

  beforeEach(() => {
    smtpOptions = {
      host: "smtp.example.com",
      port: 587,
      user: "user@example.com",
      password: "password",
    };

    smtpProtocol = new ConcreteSmtpProtocol(smtpOptions);

    mockSocket = {
      write: jest.fn(),
      end: jest.fn(),
    } as unknown as tls.TLSSocket;

    mockEmail = {
      to: "to@example.com",
      subject: "Test",
      body: "This is a test email",
    } as Email;
  });

  it("should be defined", () => {
    expect(smtpProtocol).toBeDefined();
  });

  it("should initialize with correct options", () => {
    expect(smtpProtocol["options"]).toEqual({
      host: smtpOptions.host,
      port: smtpOptions.port,
    });
    expect(smtpProtocol["user"]).toEqual(smtpOptions.user);
    expect(smtpProtocol["password"]).toEqual(smtpOptions.password);
  });

  it("should handle GREETING", () => {
    smtpProtocol["handlers"][SmtpCodes.GREETING](mockSocket, mockEmail, "220");
    expect(mockSocket.write).toHaveBeenCalledWith(
      `AUTH LOGIN  ${Buffer.from(smtpOptions.user).toString("base64")}\r\n`
    );
  });

  it("should handle AUTH_LOGIN", () => {
    smtpProtocol["handlers"][SmtpCodes.AUTH_LOGIN](
      mockSocket,
      mockEmail,
      "334"
    );
    expect(mockSocket.write).toHaveBeenCalledWith(
      `${Buffer.from(smtpOptions.password).toString("base64")}\r\n`
    );
  });

  it("should handle AUTH_SUCCESS", () => {
    smtpProtocol["handlers"][SmtpCodes.AUTH_SUCCESS](
      mockSocket,
      mockEmail,
      "2.1.5"
    );
    expect(mockSocket.write).toHaveBeenCalledWith(
      `MAIL FROM:<${smtpOptions.user}>\r\n`
    );
  });

  it("should handle MAIL_FROM_SUCCESS with secondaryCode 2.1.0", () => {
    smtpProtocol["handlers"][SmtpCodes.MAIL_FROM_SUCCESS](
      mockSocket,
      mockEmail,
      "2.1.0"
    );
    expect(mockSocket.write).toHaveBeenCalledWith(
      `RCPT TO:<${mockEmail.to}>\r\n`
    );
  });

  it("should handle MAIL_FROM_SUCCESS with secondaryCode 2.1.5", () => {
    smtpProtocol["handlers"][SmtpCodes.MAIL_FROM_SUCCESS](
      mockSocket,
      mockEmail,
      "2.1.5"
    );
    expect(mockSocket.write).toHaveBeenCalledWith(`DATA\r\n`);
  });

  it("should handle DATA_SUCCESS", () => {
    smtpProtocol["handlers"][SmtpCodes.DATA_SUCCESS](
      mockSocket,
      mockEmail,
      "2.1.5"
    );

    expect(mockSocket.write).toHaveBeenCalledWith(
      `Subject: ${mockEmail.subject}\r\n` +
        `Content-Type: text/html; charset="UTF-8"\r\n\r\n` +
        `${mockEmail.body}\r\n.\r\n`
    );

    expect(mockSocket.write).toHaveBeenCalledWith("QUIT\r\n");
  });

  it("should handle MAILBOX_UNAVAILABLE", () => {
    smtpProtocol["handlers"][SmtpCodes.MAILBOX_UNAVAILABLE](
      mockSocket,
      mockEmail,
      "2.1.5"
    );
    expect(mockSocket.end).toHaveBeenCalled();
  });

  it("should handle BYE", () => {
    smtpProtocol["handlers"][SmtpCodes.BYE](mockSocket, mockEmail, "2.1.5");
    expect(mockSocket.end).toHaveBeenCalled();
  });
});
