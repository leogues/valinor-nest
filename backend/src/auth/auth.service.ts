import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { Repository } from 'typeorm';
import { AuthDTO } from './auth';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  findOne(source: string, sourceId: string) {
    return this.authRepository.findOne({
      where: { source: source, sourceId: sourceId },
      relations: ['user'],
    });
  }

  create({
    sourceId,
    source,
    accessToken,
    refreshToken,
    expires,
    userId,
  }: AuthDTO) {
    return this.authRepository.save({
      sourceId,
      source,
      accessToken,
      refreshToken,
      expires,
      userId,
    });
  }

  update(id: number, partialAuth: Partial<AuthDTO>) {
    return this.authRepository.update(id, { ...partialAuth });
  }
}
