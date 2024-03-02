import { Body } from "@core/api/decorators/body.decorator";
import { Controller } from "@core/api/decorators/controller.decorator";
import { Get, Post } from "@core/api/decorators/handlers.decorator";
import { Validate } from "@core/validation/guards/validator.guard";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { AuthService } from "src/domain/services/auth.service";
import { CreateUserDto } from "src/domain/dto/create-user.dto";
import { User } from "src/domain/entities/user.entity";
import { JwtRequest, MetaResponse } from "@core/api/types";
import { ResponseEntity } from "@core/api/entities/response.entity";
import { Req } from "@core/api/decorators/req.decorator";
import { ApiKey } from "@core/api/guards/api-key.guard";
import { Auth } from "@core/auth/guards/auth.guard";
import { JwtPayloadUser } from "@core/auth/types";
import { Credentials } from "src/domain/dto/credentials.dto";
import { TokenResponseDto } from "src/domain/dto/token-response.dto";
import { RefreshTokenDto } from "src/domain/dto/refresh-token-dto";
import { ResetPasswordDto } from "src/domain/dto/reset-password.dto";
import { Param } from "@core/api/decorators/param.decorator";

@Controller("/auth")
export class AuthController {
  private readonly logger = new ConsoleLogger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @Validate(CreateUserDto)
  async signup(@Body() user: User): MetaResponse<User> {
    this.logger.debug(`[🔒 ${user.username}]: Signing up`);

    const response = await this.authService.register(user);

    if (response.error) {
      return ResponseEntity.badRequest(response);
    }

    this.logger.debug(`[🔒 ${user.username}]: Signed up`);

    return ResponseEntity.created(response);
  }

  @Get("/me")
  @Auth()
  @ApiKey()
  async me(@Req() req: JwtRequest<User>): MetaResponse<Partial<User>> {
    const user = req.user as JwtPayloadUser;

    this.logger.debug(`[🔒 ${user.username}]: Fetching user`);

    const response = await this.authService.me(user);

    if (response.error) {
      return ResponseEntity.notFound();
    }

    this.logger.debug(`[🔒 ${user.username}]: Fetched user`);

    return ResponseEntity.ok(response);
  }

  @Post("/login")
  @Validate(Credentials)
  async login(
    @Body() credentials: Credentials
  ): MetaResponse<TokenResponseDto> {
    const { username, password } = credentials;

    this.logger.debug(`[🔒 ${username}]: Logging in`);

    const response = await this.authService.login({ username, password });

    if (response.error) {
      return ResponseEntity.unauthorized();
    }

    this.logger.debug(`[🔒 ${username}]: Logged in`);

    return ResponseEntity.ok(response);
  }

  @Post("/logout")
  @Auth()
  async logout(@Req() req: JwtRequest<User>): MetaResponse<void> {
    const user = req.user as User;

    this.logger.debug(`[🔒 ${user.username}]: Logging out`);

    const response = await this.authService.logout(user.username);

    if (response.error) {
      return ResponseEntity.badRequest();
    }

    this.logger.debug(`[🔒 ${user.username}]: Logged out`);

    return ResponseEntity.noContent();
  }

  @Post("/refresh")
  @Validate(RefreshTokenDto)
  async refresh(
    @Body() body: { refreshToken: string }
  ): MetaResponse<TokenResponseDto> {
    this.logger.debug(`[🔒]: Refreshing token`);

    const response = await this.authService.refresh(body.refreshToken);

    if (response.error) {
      return ResponseEntity.unauthorized();
    }

    this.logger.debug(`[🔒]: Refreshed token`);

    return ResponseEntity.ok(response);
  }

  @Post("/forgot-password")
  async forgotPassword(@Body() user: User): MetaResponse<void> {
    const { email } = user;

    this.logger.debug(`[🔒 ${email}]: Forgot password`);

    const response = await this.authService.forgotPassword(email);

    if (response.error) {
      return ResponseEntity.badRequest();
    }

    return ResponseEntity.noContent();
  }

  @Post("/reset-password/:token")
  async resetPassword(
    @Body() user: ResetPasswordDto,
    @Param("token") token: string
  ): MetaResponse<void> {
    const { newPassword } = user;

    this.logger.debug(`[🔒]: Resetting password`);

    const response = await this.authService.resetPassword(token, newPassword);

    if (response.error) {
      return ResponseEntity.badRequest();
    }

    this.logger.debug(`[🔒]: Reset password`);

    return ResponseEntity.noContent();
  }

  @Post("/verify-email/:token")
  async verifyEmail(@Param("token") token: string): MetaResponse<void> {
    this.logger.debug(`[🔒]: Verifying email`);

    const response = await this.authService.verifyEmail(token);

    if (response.error) {
      return ResponseEntity.badRequest();
    }

    this.logger.debug(`[🔒]: Verified email`);

    return ResponseEntity.noContent();
  }
}
