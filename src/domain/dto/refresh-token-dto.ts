import { IsString } from "@core/validation/decorators/string.validation";

export class RefreshTokenDto {
  @IsString()
  public refreshToken: string;
}
