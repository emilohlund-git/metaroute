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

## Installation

Since the package is currently deployed to Github Packages, you're going to need to specify using the github packages registry when installing the package.

```bash
# if you don't have an .npmrc file in your project root specifying the github registry.
npm install @emilohlund-git/metaroute@latest --registry https://npm.pkg.github.com
```

This is also going to make you authenticate with github, so you will have to log in using your github email address and a personal access token.

## Usage

To use the package simply import what you need from the package. The first thing you have to do is to establish an Application, which will be the starting-point of the framework. You can do it like so:

```typescript
import { Application, App } from "@emilohlund-git/metaroute";

@App({
  middleware: [JsonMiddleware, CorsMiddleware, LoggingMiddleware],
  errorMiddleware: [LogErrorMiddleware]
})
export class MetaRouteApplication extends Application {}
```

The `@App` decorator handles setting up the different systems that the framework is built up from. It's all done behind the scenes.
The `@App` decorator can also take a configuration object `AppConfiguration` as an argument.

```typescript
interface AppConfiguration {
  middleware?: Middleware[];
  errorMiddleware?: ErrorMiddleware[];
  // Defaults to 3000.
  port?: number; 
  // If you pass a cert.pem and key.pem the application will create a https server instead, defaults to http.
  ssl?: {
    key: string;
    cert: string;
  }; 
  // The rendering engine for dynamic HTML content, defaults to the built-in MetaEngine.
  engine?: Engine; 
}
```

After you've established your application starting point you can go ahead and create controllers to define routes for your API:

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

## Features

### Route Caching

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

### JWT Authorization

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

### Email Server

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

### Templating Engine

It's possible to set up an a controller that renders dynamic HTML content. The framework will look for returned data from a route handler that matches the following shape:

```typescript
// Hypothetical controller:
@Controller("/ui")

@Get("/")
async renderHtml() {
  return ResponseEntity.ok({
    template: path.join(process.cwd(), "static", "template.html"),
    data: {
      variableToPassToRenderEngine: "Hello!",
      aLotOfData: [
        {
          hello: "hi!",
          world: "universe"
        },
        {
          hello: "dogs",
          world: "cats"
        }
      ],
      isCool: true
    }
  })
}
```

The template syntax is as follows:

```html
<!DOCTYPE html>
  <body>
    {{variableToPassToRenderEngine}}

    <ul>
    {{#each aLotOfData}}
      <li>{{this.hello}}</li>
      <li>{{this.world}}</li>
    {{/each}}
    </ul>

    {{#if isCool}}
      <p>Very cool!</p>
    {{else}}
      <p>Not so cool.</p>
    {{/if}}
  </body>
</html>
```

Which would render:

```html
<!DOCTYPE html>
  <body>
    Hello!

    <ul>
      <li>hi!</li>
      <li>universe</li>
      <li>dogs</li>
      <li>cats</li>
    </ul>

    <p>Very cool!</p>
  </body>
</html>
```

### Memory Manager

The memory manager works by applying it policies, which can be done by extending the abstract `MetaRouteMemoryPolicy` class:

```typescript
import { MemoryUsage } from "../dtos/memory.usage.dto";

export abstract class MetaRouteMemoryPolicy {
  abstract setup(): void;
  abstract check(memoryUsage: MemoryUsage): boolean;
}
```

And decorating the policy with a `@MemoryPolicy` decorator:

```typescript
import { MetaRouteMemoryPolicy, MemoryUsage, ConsoleLogger, MemoryPolicy, MemoryManager } from "@emilohlund-git/metaroute";

@MemoryPolicy
export class PrintMemoryUsagePolicy extends MetaRouteMemoryPolicy {
  private readonly logger = new ConsoleLogger(MemoryManager.name);

  setup(): void {}

  check(memoryUsage: MemoryUsage): boolean {
    const formattedMemoryUsage = `Memory usage: [rssInMb]: ${memoryUsage.rssInMB.toFixed(
      2
    )}, [heapTotalInMb]: ${memoryUsage.heapTotalInMB.toFixed(
      2
    )}, [heapUsedInMb]: ${memoryUsage.heapUsedInMB.toFixed(
      2
    )}, [externalInMb]: ${memoryUsage.externalInMB.toFixed(2)}`;
    this.logger.info(formattedMemoryUsage);
    return false; // This rule never reports a violation
  }
}
```

The default behavior of the `MemoryManager` is to console log an error message if a memory violation has occured (returning true in the check method of the memory policy).

### Data Validation

There is a selection of validation property decorators available with the framework. Such as:

```typescript
export class UserEntity {
  @IsBoolean()
  verified: boolean;

  @IsString()
  name: string;

  @IsPassword()
  password: string;

  @IsNumber()
  age: number;

  @IsDate()
  birthYear: Date;

  @IsUsername()
  username: string;

  @IsEmail()
  email: string;
}
```

They will be used in conjunction with the `@Validate()` method decorator.

```typescript
@Get("/")
@Validate(UserEntity) // This will validate the user entity based on the validation property decorators attached to the entities properties.
async createUser(@Body() user: UserEntity) {
  return user;
}
```

If the validations fail a detailed array of objects based on the failing property will be returned, with a message declaring what went wrong with the validation.

### API Key Guard

If you have an API key specified in your .env.[NODE_ENV] file the ApiKey will try to match the incoming `x-api-key` header towards it, and return an unauthorized http status if it fails.  

```typescript
@Get("/")
@ApiKey()
async getSecretData() {
  return "Super secret!";
}
```

### Logging Service

There is a built in logging service available with the framework. You simply instantiate it where you want to use it and give it a context.

```typescript
import { ConsoleLogger } from "@emilohlund-git/metaroute";

const logger = new ConsoleLogger("ContextName");

logger.info("Hello there world!");

// The logged message will look like:
`[⚡ MetaRoute] - 2024-03-02T23:05:28.822Z - INFO - [EventRouter] - Hello there world!`
```

It is possible to change the format of the logging message from the `.env` file:

```bash
LOG_FORMAT="[⚡ MetaRoute] - {timestamp} - {level} - {context} - {message}{data}"
```

There is an additional parameter to pass in to the logger, which is a data object. The logger will stringify the object and print it out.

### Configuration Service

The purpose of the `ConfigService` is simply to enforce existance of environment variables, it will throw an `EnvironmentException` with a message if which key failed if it fails to get a key from the `process.env` object.

```typescript
import { ConfigService } from "@emilohlund-git/metaroute";

// Either get the service from the global dependency container
const configService = MetaRoute.get(ConfigService);

const envVariable = configService.get("ENV_VARIABLE_NAME");

// Or by dependency injection
constructor(private readonly configService: ConfigService) {}
```

### Socket.IO Server Implementation

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

If you have any questions or need further clarification, feel free to reach out to me at [emil@emilohlund.dev](mailto:emil@emilohlund.dev).
