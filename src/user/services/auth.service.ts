import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: CreateUserDto) {
    const user = await this.userService.create(userDto);
    const token = await this._createToken(user);
    return {
      email: user.email,
      ...token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByLogin(loginUserDto);
    const token = await this._createToken(user);

    return {
      email: user.email,
      ...token,
    };
  }

  async validateUser(email) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private async _createToken(
    { email },
    isSecondFactorAuthenticated = false,
    refresh = false,
  ) {
    //convert email to access token
    const accessToken = this.jwtService.sign({
      email,
      isSecondFactorAuthenticated,
    });
    if (!refresh) {
      const refreshToken = this.jwtService.sign(
        { email },
        {
          secret: process.env.SECRET_KEY_REFRESH,
          expiresIn: process.env.EXPIRESIN_REFRESH,
        },
      );

      await this.userService.update(
        {
          email: email,
        },
        {
          refreshToken: refreshToken,
        },
      );

      return {
        expiresIn: process.env.EXPIRESIN,
        expiresInRefresh: process.env.EXPIRESIN_REFRESH,
        accessToken,
        refreshToken,
      };
    } else {
      return {
        expiresIn: process.env.EXPIRESIN,
        accessToken,
      };
    }
  }

  async refresh(refresh_token) {
    try {
      const payload = await this.jwtService.verify(refresh_token, {
        secret: process.env.SECRET_KEY_REFRESH,
      });
      const user = await this.userService.getUserByRefresh(
        refresh_token,
        payload.email,
      );
      const token = await this._createToken(user, true);
      return {
        email: user.email,
        ...token,
      };
    } catch (e) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(user: User) {
    await this.userService.update(
      { email: user.email },
      { refreshToken: null },
    );
  }

  async getAccess2FA(user) {
    return this._createToken(user, true);
  }
}
