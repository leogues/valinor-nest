import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/entities/auth.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), UsersModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
