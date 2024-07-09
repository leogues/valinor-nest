import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOrCreate({ email, firstName, lastName, picture }: UserDTO) {
    let user = await this.userRepository.findOneBy({ email });

    if (!user) {
      user = await this.create({ email, firstName, lastName, picture });
    }

    return user;
  }

  findOne(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  create({ email, firstName, lastName, picture }: UserDTO) {
    return this.userRepository.save({
      email,
      firstName,
      lastName,
      picture,
    });
  }
}
