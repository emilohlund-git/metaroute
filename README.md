<p align="center">
  <img src="./metaroute-logo.png" alt="MetaRoute Logo" width="300" />
</p>

<p align="center">
  <b>Use at your own risk.</b>
</p>

---

<p align="center">
  MetaRoute is a passion project made for personal experience and exploration. It's a fully fleged API framework with tons of built in features. It operates through the use of decorators. The biggest reason for building this project was to try to make an API framework with next to no dependencies. The only dependencies used currently is Socket.IO & reflect-metadata.
</p>

## Table of Contents 📖

- [Installation 🛠️](#installation)
- [Usage 🔧](#usage)
- [Features 🚀](#features)
  - [Route Caching 🔒](#route-caching)
  - [JWT Authorization 🔐](#jwt-authorization)
  - [Email Server 📧](#email-server)
  - [Templating Engine 🎨](#templating-engine)
  - [Memory Manager 🧠](#memory-manager)
  - [Data Validation ✅](#data-validation)
  - [API Key Guard 🛡️](#api-key-guard)
  - [Logging Service 📝](#logging-service)
  - [Configuration Service ⚙️](#configuration-service)
  - [Decorative Approach to Controller/Route Management 🎀](#decorative-approach-to-controllerroute-management)
  - [Socket.IO Server Implementation 📡](#socketio-server-implementation)
- [Contributing 🤝](#contributing)
- [License 📄](#license)
- [Contact 📧](#contact)

## Installation 🛠️

Since the package is currently deployed to Github Packages, you're going to need to specify using the github packages registry when installing the package.

```bash
# if you don't have an .npmrc file in your project root specifying the github registry.
npm install @emilohlund-git/metaroute@latest --registry https://npm.pkg.github.com
```

This is also going to make you authenticate with github, so you will have to log in using your github email address and a personal access token.

## Usage 🔧

To use the package simply import what you need from the package.

```typescript
import {
  Get,
  Controller,
  App,
  ResponseEntity,
  MetaResponse,
} from "@emilohlund-git/metaroute";
import { TestService } from "../services/test.service.ts";

@Controller("/test")
class TestController {
  constructor(private readonly testService: TestService) {}

  @Get("")
  async getTest(): MetaResponse<string> {
    const data = this.testService.getTest();
    return ResponseEntity.ok(data);
  }
}
```

The framework operates with the use of decorators. Which means you can for example have your `TestService` class injected to the `TestController` by decorating it with a `@Injectable()` decorator.

```typescript
import { Injectable } from "@emilohlund-git/metaroute";

@Injectable()
export class TestService {
  getTest() {
    return "Test";
  }
}
```

## Features 🚀

### Route Caching 🔒

To enable Route caching, use the `@Cache()` decorator on the route. The cache stores responses and uses the `maxSize` option to remove the oldest entries when full.

```typescript
@Get("")
@Cache({
  ttl: 60,
  maxSize: 100
})
async getTest(): MetaResponse<string> {
  const data = this.testService.getTest();
  return ResponseEntity.ok(data);
}
```

### JWT Authorization 🔐

Secure your API endpoints with JSON Web Token (JWT) authorization. Use the `@Auth` annotation to restrict access based on user authentication.

First of all you would need to create a service to handle the basic authentication logic. Example:

```typescript
import { CryptService, ConfigService, JwtService } from "@emilohlund-git/metaroute";
import { UserService } from "../services/user.service.ts";
import { User } from "../entities/user.entity.ts";

@Injectable()
export class AuthService {
  constructor(
    private readonly encryptionService: CryptService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(credentials: Credentials): Promise<LoginUserResponse> {
    // Check if user exists in the database
    const user = await this.db.find({ username: credentials.username });
    if (!user) return {
      status: HttpStatus.BAD_REQUEST,
      message: "User does not exist"
    }

    // Compare the hashed passwords
    const passwordMatches = await this.encryptionService.comparePasswords(password, user.password);

    if (!passwordMatches) return {
      success: false,
      error: "Invalid password"
    }

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;

    // Create access and refresh tokens
    const token = await JwtService.signTokenAsync(
      userWithoutPassword,
      this.configService.get("JWT_SECRET"),
      "15m"
    )

    const refreshToken = await JwtService.signTokenAsync(
      userWithoutPassword,
      this.configService.get("REFRESH_SECRET"),
      "7d"
    )

    if (!token || !refreshToken) return {
      success: false,
      error: "Failed creating tokens"
    }

    // Save refreshToken to user in database
    user.refreshToken = refreshToken;

    try {
      await this.userService.update(user);
    } catch (error) {
      throw new DatabaseException(error.message);
    }

    return {
      success: true,
      data: { token, refreshToken }
    }
  }

  async register(user: CreateUserDto): Promise<RegisterUserResponse> {
    // Check if user exists in the database
    const userExists = await this.db.find(user);
    if (userExists) return {
      status: HttpStatus.BAD_REQUEST,
      message: "User already exists"
    }

    // Encrypt the users password
    const salt = this.encryptionService.generateSalt();
    const hashedPassword = this.encryptionService.hashPassword(user.password, salt);

    // Save the user in the database
    try {
      await this.db.save(user);
    catch (error) {
      throw new DatabaseException(error.message);
    }

    return {
      status: HttpStatus.CREATED,
      message: "User registeredsuccesfully"
    }
  }
}
```

The `@Auth` decorator enforces authentication on a route. It intercepts the `MetaRouteRequest` object and adds the token user object to it. For this to work there needs to be some environment variables set:

`JWT_SECRET=` and `REFRESH_SECRET=`

```typescript
import { Get, Auth, Req, MetaRouteRequest, ResponseEntity } from "@emilohlund-git/metaroute";

@Get("/me")
@Auth()
async me(@Req() req: JwtRequest<User>): MetaResponse<CreateUserResponse> {
  const data = await this.authService.me(req);
  return ResponseEntity.ok(data);
}
```

### Email Server 📧

The built-in SmtpClient only works only works on port 465 and uses the SMTP protocol. But it should be a quick-start approach to handle emails if you can make use of SMTP.

```typescript
import { SmtpClient, SmtpOptions } from "@emilohlund-git/metaroute";

export interface SmtpOptions {
  host: string;
  user: string;
  password: string;
}

async send(email: Email, options: SmtpOptions) {
  const smptClient = new SmtpClient(options);
  try {
    const result = await smtpClient.send(email);
    return result;
  } catch (error) {
    // Handle error
  }
}
```

### Templating Engine 🎨

Documentation to be added.

### Memory Manager 🧠

Documentation to be added.

### Data Validation ✅

Documentation to be added.

### API Key Guard 🛡️

Documentation to be added.

### Logging Service 📝

Documentation to be added.

### Configuration Service ⚙️

Documentation to be added.

### Decorative Approach to Controller/Route Management 🎀

Documentation to be added.

### Socket.IO Server Implementation 📡

You can implement a socket server using the `@SocketServer` decorator.
It will create a namespace with the parameter name. The `@OnMessage` decorator will listen to events on said namespace with the parameter event name. 

```typescript
import { SocketServer, OnMessage } from "@emilohlund-git/metaroute";

@SocketServer("namespace")
export class SocketController {

  @OnMessage("hello")
  async hello(data: any, socket: Socket): Promise<string> {
    return "world!";
  }
}
```

## Contributing 🤝

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact 📧

If you have any questions or need further clarification, feel free to reach out to me at [emil@emilohlund.dev](mailto:emil@emilohlund.dev).
