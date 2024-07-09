import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Providers } from '../constants';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(Providers.google) {}
