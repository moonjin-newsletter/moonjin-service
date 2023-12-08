import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  async join(email: string, name: string): Promise<User> {
    return await this.userRepository.createUser({
      email,
      name,
    });
  }
}
