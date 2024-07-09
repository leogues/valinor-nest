import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { OAuthDTO } from './dto/auth.dto';
import { OAuthUserDTO } from './dto/user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  async validateOAuthUser(authDTO: OAuthDTO, userDTO: OAuthUserDTO) {
    let auth = await this.authService.findOne(authDTO.source, authDTO.sourceId);

    if (auth) {
      await this.authService.update(auth.id, {
        accessToken: authDTO.accessToken,
        refreshToken: authDTO.refreshToken,
        expires: authDTO.expires,
      });

      return auth.user;
    }

    const user = await this.userService.findOrCreate({
      email: userDTO.email,
      firstName: userDTO.firstName,
      lastName: userDTO.lastName,
      picture: userDTO.picture,
    });

    auth = await this.authService.create({
      sourceId: authDTO.sourceId,
      source: authDTO.source,
      accessToken: authDTO.accessToken,
      refreshToken: authDTO.refreshToken,
      expires: authDTO.expires,
      userId: user.id,
    });

    auth.user = user;

    return auth.user;
  }
}
