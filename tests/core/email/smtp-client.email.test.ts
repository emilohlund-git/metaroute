import "reflect-metadata";
import * as tls from "tls";
import { EventEmitter } from "events";
import {
  Email,
  EmailParseException,
  SmtpClient,
  SmtpCommands,
  SmtpOptions,
} from "@core/email";

jest.mock("tls");

describe("SmtpClient", () => {
  let smtpOptions: SmtpOptions;
  let smtpClient: SmtpClient;
  let email: Email;

  beforeEach(() => {
    smtpOptions = {
      host: "smtp.example.com",
      port: 587,
      user: "user",
      password: "pass",
    };
    smtpClient = new SmtpClient(smtpOptions);
    email = new Email();
    email.to = "test@example.com";
    email.from = "noreply@example.com";
    email.subject = "Test email";
    email.body = "This is a test email.";

    (tls.connect as jest.Mock).mockImplementation((options, callback) => {
      const mockSocket = {
        on: jest.fn(),
        write: jest.fn(),
      } as any as tls.TLSSocket;

      process.nextTick(callback);

      return mockSocket;
    });
  });

  it("should send an email successfully", async () => {
    await smtpClient.send(email);
    expect(tls.connect).toHaveBeenCalledWith(
      {
        host: smtpOptions.host,
        port: smtpOptions.port,
      },
      expect.any(Function)
    );
    expect(
      (tls.connect as jest.Mock).mock.results[0].value.write
    ).toHaveBeenCalledWith(`${SmtpCommands.HELO}`);
  });

  it("should handle error when connecting to server", async () => {
    (tls.connect as jest.Mock).mockImplementation(() => {
      throw new Error("Connection error");
    });

    smtpClient["logger"].error = jest.fn();

    const result = await smtpClient.send(email);

    expect(result).toBe(false);
    expect(smtpClient["logger"].error).toHaveBeenCalledWith(
      "Error sending email: Connection error"
    );
  });

  it("should connect to server successfully", async () => {
    const client = await smtpClient["connectToServer"]();

    expect(tls.connect).toHaveBeenCalledWith(
      {
        host: smtpOptions.host,
        port: smtpOptions.port,
      },
      expect.any(Function)
    );
    expect(client.write).toHaveBeenCalledWith(`${SmtpCommands.HELO}`);
  });

  it("should listen to client successfully", async () => {
    const client = await smtpClient["connectToServer"]();
    const data = "250 OK";

    client.on = jest.fn().mockImplementation((event, callback) => {
      if (event === "data") {
        callback(data);
      }
      return client;
    });

    await smtpClient["listenToClient"](client, email);

    expect(client.on).toHaveBeenCalledWith("data", expect.any(Function));
    expect(client.on).toHaveBeenCalledWith("end", expect.any(Function));
  });

  it("should handle response successfully", async () => {
    const client = await smtpClient["connectToServer"]();
    const response = "250 2.1.5 OK";

    smtpClient["handlers"] = {
      "250": jest.fn(),
    };

    await smtpClient["handleResponse"](client, response, email);

    expect(smtpClient["handlers"]["250"]).toHaveBeenCalledWith(
      client,
      email,
      "2.1.5"
    );
  });

  it("should handle client end event", async () => {
    const client = await smtpClient["connectToServer"]();

    smtpClient["logger"].debug = jest.fn();

    client.on = jest.fn().mockImplementation((event, callback) => {
      if (event === "end") {
        callback();
      }
      return client;
    });

    await smtpClient["listenToClient"](client, email);

    expect(client.on).toHaveBeenCalledWith("end", expect.any(Function));

    expect(smtpClient["logger"].debug).toHaveBeenCalledWith(`Connection ended`);
  });

  it("should throw an error when there's no handler for a given primary code", async () => {
    const client = await smtpClient["connectToServer"]();
    const response = "999 2.1.5 OK";

    await expect(
      smtpClient["handleResponse"](client, response, email)
    ).rejects.toThrow(EmailParseException);
  });

  it("should end the client connection when an error occurs", async () => {
    const client = new EventEmitter() as unknown as tls.TLSSocket;
    client.end = jest.fn();

    smtpClient["handleResponse"] = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    const endSpy = jest.spyOn(client, "end");

    await smtpClient["listenToClient"](client, email)
      .then(() => {
        try {
          client.emit("data", "999 2.1.5 OK");
        } catch (error) {
          expect(endSpy).toHaveBeenCalled();
        }
      })
      .catch(() => {
        expect(endSpy).toHaveBeenCalled();
      });
  });

  it("should parse email response with no secondary code", () => {
    const response = "250";
    const [primaryCode, secondaryCode] =
      smtpClient["parseEmailResponse"](response);

    expect(primaryCode).toBe("250");
    expect(secondaryCode).toBe("");
  });

  it("should throw an error when the response format is incorrect", () => {
    const response = "invalid response format";

    expect(() => smtpClient["parseEmailResponse"](response)).toThrow(
      EmailParseException
    );
  });
});
