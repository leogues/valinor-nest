import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthenticationService } from '../authentication.service';
import { Providers } from '../constants';
import { OAuthDTO } from '../dto/auth.dto';
import { OAuthUserDTO } from '../dto/user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  Providers.google,
) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      accessType: 'offline',
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const {
      sub: id,
      given_name: firstName,
      family_name: lastName,
      email,
      picture,
    } = profile._json;

    const authDto = new OAuthDTO();
    authDto.sourceId = id;
    authDto.source = Providers.google;
    authDto.accessToken = accessToken;
    authDto.refreshToken = refreshToken;
    authDto.expires = null;

    const userDto = new OAuthUserDTO();
    userDto.email = email;
    userDto.firstName = firstName;
    userDto.lastName = lastName;
    userDto.picture = picture;

    return this.authenticationService.validateOAuthUser(authDto, userDto);
  }
}
