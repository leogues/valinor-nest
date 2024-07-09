import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from 'src/users/user';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<UserPayload>(token, {
        secret: jwtConstants.secret,
      });
      const user = await this.usersService.findByID(payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const headers = request.headers;
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
