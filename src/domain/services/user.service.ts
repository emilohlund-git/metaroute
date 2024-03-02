import { CodeFirstService } from "@core/code-first/services/code-first.service";
import { Injectable } from "@core/common/decorators/injectable.decorator";
import { User } from "../entities/user.entity";
import { UserRepository } from "src/infrastructure/repositories/user.repository";

@Injectable
export class UserService extends CodeFirstService<User> {
  constructor(protected readonly userRepository: UserRepository) {
    super(userRepository);
  }
}
