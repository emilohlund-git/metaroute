import "reflect-metadata";
import { Email } from "@core/email/entities/email.entity";
import { validator } from "@core/validation/functions/validator";

describe("Email", () => {
  it("should create a valid Email object", async () => {
    const email = new Email();
    email.to = "test@example.com";
    email.subject = "Test Subject";
    email.body = "Test Body";

    const validationErrors = validator(email, Email);
    expect(validationErrors).toEqual({});
  });

  it("should fail validation if any property is not a string", async () => {
    const email = new Email();
    email.to = 123 as any;
    email.subject = { key: "value" } as any;
    email.body = false as any;

    const validationErrors = validator(email, Email);
    expect(validationErrors).toEqual({
      body: ["Must be a string."],
      subject: ["Must be a string."],
      to: ["Must be a string."],
    });
  });
});
