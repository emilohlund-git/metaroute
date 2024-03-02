import { DatabaseResponse } from "@core/database/interfaces/database-response.interface";
import { Credentials } from "../dto/credentials.dto";
import { TokenResponseDto } from "../dto/token-response.dto";

export interface IAuthService<T> {
  register(user: T): Promise<DatabaseResponse<T> | null>;
  login(
    credentials: Credentials
  ): Promise<DatabaseResponse<TokenResponseDto> | null>;
  logout(username: string): Promise<DatabaseResponse<boolean>>;
  forgotPassword(email: string): Promise<DatabaseResponse<boolean>>;
  resetPassword(
    token: string,
    newPassword: string
  ): Promise<DatabaseResponse<boolean>>;
}
