import { IsEmail } from "@core/validation";
import { IsString } from "../../validation/decorators/string.validation";

export class Email {
  @IsEmail()
  public to: string;
  @IsEmail()
  public from: string;
  @IsString()
  public subject: string;
  @IsString()
  public body: string;
}
