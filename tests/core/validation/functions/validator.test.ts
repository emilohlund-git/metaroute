import { IsBoolean, IsDate, IsEnum, IsNumber, IsString, validator } from "src";

enum TestEnum {
  Option1 = "option1",
  Option2 = "option2",
}

class Entity {
  @IsString()
  string: string = "string";
  @IsNumber()
  number?: number = 1234;
  @IsBoolean()
  boolean: boolean = true;
  @IsDate()
  date: Date = "2022-01-01T00:00:00.000Z" as any as Date;
  @IsEnum(TestEnum)
  enum: "option1" | "option2" = "option1";
  @IsString()
  invalidString?: string = 1234 as any as string;
}

describe("Validator", () => {
  it("should return errors for missing properties", () => {
    const invalidEntity = new Entity();
    delete invalidEntity.number;
    const result = validator(invalidEntity, Entity);
    expect(result).toEqual({
      number: ["Property is missing"],
      invalidString: ["Value must be a string."],
    });
  });

  it("should ignore specified properties", () => {
    const invalidEntity = new Entity();
    const result = validator(invalidEntity, Entity, ["invalidString"]);
    expect(result).toEqual({});
  });

  it("should continue validation when property does not exist in validation metadata", () => {
    const entity = new Entity() as any;
    entity.nonExistingProperty = "non-existing";
    const result = validator(entity, Entity);
    expect(result).toEqual({
      invalidString: ["Value must be a string."],
    });
  });
});
