import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsPassword,
  IsString,
  IsUsername,
  validator,
} from "src";

enum TestEnum {
  Option1 = "option1",
  Option2 = "option2",
}

class Entity {
  @IsEmail()
  email?: string = "email@email.com";
  @IsPassword()
  password: string = "Password1234";
  @IsString()
  string: string = "string";
  @IsNumber()
  number: number = 1234;
  @IsUsername()
  username: string = "username";
  @IsBoolean()
  boolean: boolean = true;
  @IsDate()
  date: Date = "2022-01-01T00:00:00.000Z" as any as Date;
  @IsEnum(TestEnum)
  enum: "option1" | "option2" = "option1";
}

describe("Validator", () => {
  it("should validate email", () => {
    const result = validator(new Entity(), Entity);
    expect(result).toEqual({});
  });

  it("should validate password", () => {
    const result = validator(new Entity(), Entity);
    expect(result).toEqual({});
  });

  it("should validate string", () => {
    const result = validator(new Entity(), Entity);
    expect(result).toEqual({});
  });

  it("should validate number", () => {
    const result = validator(new Entity(), Entity);
    expect(result).toEqual({});
  });

  it("should validate username", () => {
    const result = validator(new Entity(), Entity);
    expect(result).toEqual({});
  });

  it("should validate boolean", () => {
    const result = validator(new Entity(), Entity);
    expect(result).toEqual({});
  });

  it("should validate date", () => {
    const result = validator(new Entity(), Entity);
    expect(result).toEqual({});
  });

  it("should validate enum", () => {
    const result = validator(new Entity(), Entity);
    expect(result).toEqual({});
  });

  it("should return errors for invalid inputs", () => {
    const invalidEntity = new Entity();
    invalidEntity.email = "invalid email";
    invalidEntity.password = "123";
    invalidEntity.number = "string" as any as number;
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      email: ["Not a valid email."],
      password: ["Password must be at least 8 characters."],
      number: ["Must be a number."],
    });
  });

  it("should return errors for invalid date", () => {
    const invalidEntity = new Entity();
    invalidEntity.date = "invalid date" as any as Date;
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      date: [
        "Not a valid ISO 8601 date. It should be in the format: YYYY-MM-DDTHH:mm:ss.sssZ",
      ],
    });
  });

  it("should return errors for invalid enum", () => {
    const invalidEntity = new Entity();
    invalidEntity.enum = "invalid" as any as "option1" | "option2";
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      enum: ["Value must be one of: option1, option2"],
    });
  });

  it("should return errors for missing properties", () => {
    const invalidEntity = new Entity();
    delete invalidEntity.email;
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      email: ["Property is missing"],
    });
  });

  it("should ignore specified properties", () => {
    const invalidEntity = new Entity();
    invalidEntity.email = "invalid email";
    const result = validator(invalidEntity, Entity, ["email"]);
    expect(result).toEqual({});
  });

  it("should continue validation when property does not exist in validation metadata", () => {
    const entity = new Entity() as any;
    entity.nonExistingProperty = "non-existing";
    const result = validator(entity, Entity);
    expect(result).toEqual({});
  });

  it("should return an error if password is longer than 20 characters", () => {
    const invalidEntity = new Entity();
    invalidEntity.password =
      "Password1234Password1234Password1234Password1234Password1234";
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      password: ["Password must be no more than 20 characters."],
    });
  });

  it("should return an error if password does not contain a lowercase letter", () => {
    const invalidEntity = new Entity();
    invalidEntity.password = "PASSWORD1234";
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      password: ["Password must contain at least one lowercase letter."],
    });
  });

  it("should return an error if password does not contain any digits", () => {
    const invalidEntity = new Entity();
    invalidEntity.password = "Password";
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      password: ["Password must contain at least one digit."],
    });
  });

  it("should return an error if username contains invalid characters", () => {
    const invalidEntity = new Entity();
    invalidEntity.username = "invalid username";
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      username: [
        "Username can only include alphanumeric characters, periods, underscores, and hyphens.",
      ],
    });
  });

  it("should return an error if username is shorter than 3 characters", () => {
    const invalidEntity = new Entity();
    invalidEntity.username = "us";
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      username: ["Username must be at least 3 characters."],
    });
  });

  it("should return an error if boolean is not a boolean", () => {
    const invalidEntity = new Entity();
    invalidEntity.boolean = "not a boolean" as any as boolean;
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      boolean: ["Must be a boolean."],
    });
  });
});
