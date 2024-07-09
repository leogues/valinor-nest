import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookieSessionModule } from 'nestjs-cookie-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { dataSourceOptions } from './db/datasource';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    AuthenticationModule,
    CookieSessionModule.forRoot({
      session: {
        name: 'session',
        secret: process.env.SESSION_SECRET,
        expires: new Date(Date.now() + 60 * 1000), // 1 minute
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
