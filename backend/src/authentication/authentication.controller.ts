import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Redirect,
  Session,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { User as UserEntity } from 'src/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../decorator/user.decorator';
import { frontendUrl } from './constants';
import { CaptureRedirectGuard } from './guard/capture-redirect.guard';
import { CsrfStateGenerateGuard } from './guard/csrf-state-generate.guard';
import { CsrfStateGuard } from './guard/csrf-state.guard';
import { GoogleAuthGuard } from './guard/google.auth.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('token/:code')
  async getToken(@Param('code') code: string) {
    const token = await this.cacheManager.get(code);

    if (!token) {
      throw new NotFoundException('Invalid code');
    }

    this.cacheManager.del(code);

    return { accessToken: token };
  }

  @Get('google')
  @UseGuards(CaptureRedirectGuard, CsrfStateGenerateGuard, GoogleAuthGuard)
  signInWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard, CsrfStateGuard)
  @Redirect()
  async githubAuthCallback(
    @Session() session: { redirectUrl?: string },
    @User() user: UserEntity,
  ) {
    const code = uuidv4();
    const payload = { id: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    const redirectUrl = session.redirectUrl || '/';

    await this.cacheManager.set(code, token);

    return {
      url: `${frontendUrl}/auth/callback?code=${code}&redirect_url=${redirectUrl}`,
      statusCode: HttpStatus.MOVED_PERMANENTLY,
    };
  }
}
