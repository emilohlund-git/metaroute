import { Injectable } from "@core/common/decorators/injectable.decorator";
import { User } from "../entities/user.entity";
import { IAuthService } from "../interfaces/auth-service.interface";
import { ConsoleLogger } from "@core/common/services/console-logger.service";
import { UserService } from "./user.service";
import { ConfigService } from "@core/common/services/config.service";
import { EmailService } from "./email.service";
import { CryptService } from "@core/auth/services/crypt.service";
import { DatabaseResponse } from "@core/database/interfaces/database-response.interface";
import { JwtService } from "@core/auth/services/jwt.service";
import { TokenResponseDto } from "../dto/token-response.dto";
import { Credentials } from "../dto/credentials.dto";

export type JwtPayloadUser = {
  username: string;
  email?: string;
  iat: number;
};

@Injectable
export class AuthService implements IAuthService<User> {
  private readonly logger = new ConsoleLogger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly cryptService: CryptService
  ) {}

  async forgotPassword(email: string): Promise<DatabaseResponse<boolean>> {
    this.logger.debug(`[🔒 ${email}]: Requesting password reset`);

    const user = await this.userService.find({ email });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const resetToken = await JwtService.signTokenAsync(
      { email },
      this.configService.get("RESET_SECRET"),
      "1h"
    );

    if (!resetToken) {
      return {
        success: false,
        error: "Failed creating reset token",
      };
    }

    const resetUrl = `${this.configService.get("API_RESET_URL")}/${resetToken}`;

    const emailSent = await this.emailService.send({
      to: email,
      subject: "Password Reset",
      body: `Click the link to reset your password: ${resetUrl}`,
    });

    if (!emailSent) {
      return {
        success: false,
        error: "Failed sending reset email",
      };
    }

    this.logger.debug(`[🔒 ${email}]: Sent password reset email`);

    return {
      success: true,
      data: true,
    };
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<DatabaseResponse<boolean>> {
    let email;
    try {
      this.logger.debug(`[🔒 ${email}]: Resetting password`);

      const decoded = await JwtService.verifyTokenAsync(
        token,
        this.configService.get("RESET_SECRET")
      );
      email = decoded.email;
    } catch (err) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    const response = await this.userService.find({ email });
    if (!response.data)
      return {
        success: false,
        error: "User not found",
      };

    const user = response.data;

    user.password = newPassword;
    const updatedUser = await this.userService.update(user, user.id);

    if (!updatedUser) {
      return {
        success: false,
        error: "Failed updating password",
      };
    }

    await this.emailService.send({
      to: user.email,
      subject: "Password Reset",
      body: "Your password has been reset",
    });

    this.logger.debug(`[🔒 ${email}]: Reset password`);

    return {
      success: true,
      data: true,
    };
  }

  async register(user: User): Promise<DatabaseResponse<User>> {
    this.logger.debug(`[🔒 ${user.email}]: Registering user`);

    const token = await this.createEmailVerificationToken(user);

    if (!token) {
      return {
        success: false,
        error: "Failed creating email verification token",
      };
    }

    user.verified = false;

    const salt = await this.cryptService.generateSalt();
    const hashedPassword = await this.cryptService.hashPassword(
      user.password,
      salt
    );
    user.password = hashedPassword;

    const response = await this.userService.save(user);

    if (!response.data) return response;

    const savedUser = response.data;

    const verificationLink = `${this.configService.get(
      "API_VERIFY_URL"
    )}/${token}`;
    await this.emailService.send({
      to: user.email,
      subject: "Verify Email",
      body: `Click the link to verify your email: ${verificationLink}`,
    });

    const { password: _, refreshToken: __, ...userWithoutPassword } = savedUser;

    this.logger.debug(`[🔒 ${user.email}]: Registered user`);

    return { success: true, data: userWithoutPassword as User };
  }

  async login(
    credentials: Credentials
  ): Promise<DatabaseResponse<TokenResponseDto>> {
    const { username, password } = credentials;

    const response = await this.userService.find({ username });
    if (!response.data)
      return {
        success: false,
        error: "User not found",
      };
    const user = response.data;
    const passwordMatches = await this.cryptService.comparePasswords(
      password,
      user.password
    );

    if (!passwordMatches) {
      this.logger.debug(`[🔒 ${username}]: Failed login attempt`);
      return {
        success: false,
        error: "Invalid password",
      };
    }

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;

    const token = await JwtService.signTokenAsync(
      userWithoutPassword,
      this.configService.get("JWT_SECRET"),
      "15m"
    );

    const refreshToken = await JwtService.signTokenAsync(
      userWithoutPassword,
      this.configService.get("REFRESH_SECRET"),
      "7d"
    );

    if (!token || !refreshToken) {
      this.logger.debug(`[🔒 ${username}]: Failed login attempt`);
      return {
        success: false,
        error: "Failed creating tokens",
      };
    }

    user.refreshToken = refreshToken;

    await this.userService.update(user, user.id);

    return {
      success: true,
      data: { token, refreshToken },
    };
  }

  async logout(username: string): Promise<DatabaseResponse<boolean>> {
    const response = await this.userService.find({ username });

    if (!response.data)
      return {
        success: false,
        error: "User not found",
      };
    const user = response.data;

    user.refreshToken = null;
    await this.userService.update(user, user.id);

    return {
      success: true,
      data: true,
    };
  }

  async refresh(
    refreshToken: string
  ): Promise<DatabaseResponse<TokenResponseDto>> {
    let username;
    try {
      const decoded = await JwtService.verifyTokenAsync(
        refreshToken,
        this.configService.get("REFRESH_SECRET")
      );
      username = decoded.username;
    } catch (err) {
      this.logger.debug(`[🔒]: Failed token refresh attempt`);
      return {
        success: false,
        error: "Invalid token",
      };
    }

    const response = await this.userService.find({ username });

    if (!response.data)
      return {
        success: false,
        error: "User not found",
      };
    const user = response.data;

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;

    const newToken = await JwtService.signTokenAsync(
      userWithoutPassword,
      this.configService.get("JWT_SECRET"),
      "15m"
    );

    const newRefreshToken = await JwtService.signTokenAsync(
      userWithoutPassword,
      this.configService.get("REFRESH_SECRET"),
      "7d"
    );

    if (!newToken || !newRefreshToken) {
      this.logger.debug(`[🔒 ${username}]: Failed token refresh attempt`);
      return {
        success: false,
        error: "Failed creating tokens",
      };
    }

    user.refreshToken = newRefreshToken;
    await this.userService.update(user, user.id);

    return {
      success: true,
      data: { token: newToken, refreshToken: newRefreshToken },
    };
  }

  async me(user: JwtPayloadUser): Promise<DatabaseResponse<Partial<User>>> {
    const response = await this.userService.find({
      username: user.username,
    });

    if (!response.data)
      return {
        success: false,
        error: "User not found",
      };
    const me = response.data;

    const { password: _, ...userWithoutPassword } = me;

    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  async verifyEmail(token: string): Promise<DatabaseResponse<boolean>> {
    let email;
    try {
      const decoded = await JwtService.verifyTokenAsync(
        token,
        this.configService.get("VERIFY_EMAIL_SECRET")
      );
      email = decoded.email;
    } catch (err) {
      this.logger.debug(`[🔒]: Failed email verification attempt`);
      return {
        success: false,
        error: "Invalid token",
      };
    }

    const response = await this.userService.find({ email });

    if (!response.data)
      return {
        success: false,
        error: "User not found",
      };
    const user = response.data;

    user.verified = true;
    const updatedUser = await this.userService.update(user, user.id);

    if (!updatedUser?.success) {
      this.logger.debug(`[🔒 ${email}]: Failed email verification attempt`);
      return {
        success: false,
        error: "Failed verifying email",
      };
    }

    return {
      success: true,
      data: true,
    };
  }

  private async createEmailVerificationToken(
    user: User
  ): Promise<string | null> {
    const token = await JwtService.signTokenAsync(
      { email: user.email },
      this.configService.get("VERIFY_EMAIL_SECRET"),
      "1d"
    );

    if (!token) {
      this.logger.debug(
        `[🔒 ${user.email}]: Failed creating email verification token`
      );
      return null;
    }

    return token;
  }
}
