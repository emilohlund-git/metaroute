import { IsEmail } from "@core/validation/decorators/email.validation";
import { IsPassword } from "@core/validation/decorators/password.validation";
import { IsUsername } from "@core/validation/decorators/username.validation";

export class CreateUserDto {
  @IsUsername()
  public username: string;
  @IsEmail()
  public email: string;
  @IsPassword()
  public password: string;
}
