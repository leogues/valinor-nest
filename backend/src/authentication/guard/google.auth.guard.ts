import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Providers } from '../constants';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(Providers.google) {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const state = <string>req.session.state;

    return {
      state,
    };
  }
}
