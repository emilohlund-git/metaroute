import { IsPassword } from "@core/validation/decorators/password.validation";
import { IsUsername } from "@core/validation/decorators/username.validation";

export class Credentials {
  @IsUsername()
  public username: string;
  @IsPassword()
  public password: string;
}
