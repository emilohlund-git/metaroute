import { IsString } from "../../validation/decorators/string.validation";

export class Email {
  @IsString()
  public to: string;
  @IsString()
  public from: string;
  @IsString()
  public subject: string;
  @IsString()
  public body: string;
}
