import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import * as dotenv from 'dotenv';
import { UserController } from './controllers/user.controller';
import { TwoFactorAuthenticationController } from './controllers/twoFactorAuthentication.controller';
import { TwoFactorAuthenticationService } from './services/twoFactorAuthenticationService.service';
import { JwtTwoFactorStrategy } from './jwtTwoFactor.strategy';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
  ],
  controllers: [
    UserController,
    AuthController,
    TwoFactorAuthenticationController,
  ],
  providers: [
    UserService,
    AuthService,
    UserRepository,
    JwtStrategy,
    TwoFactorAuthenticationService,
    JwtTwoFactorStrategy,
  ],
})
export class UserModule {}
