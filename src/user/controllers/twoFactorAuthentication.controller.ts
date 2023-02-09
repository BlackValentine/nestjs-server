import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { TwoFactorAuthenticationService } from '../services/twoFactorAuthenticationService.service';
import { UserService } from '../services/user.service';

@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  async generate(@Res() response: any, @Req() request: any) {
    const { otpAuthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    console.log(otpAuthUrl);
    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpAuthUrl,
    );
  }

  @Post('authenticate')
  @UseGuards(AuthGuard('jwt'))
  async authentication(@Req() request: any, @Body('code') code) {
    const isCodeValid =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,
        request.user,
      );

    if (!isCodeValid) {
      throw new HttpException(
        'Wrong authentication code',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authService.getAccess2FA(request.user);
  }

  @Post('turn-on')
  @UseGuards(AuthGuard('jwt'))
  async turnOnTwoFactorAuthentication(@Req() req: any) {
    return this.userService.turnOnTwoFactorAuthenticationSecret(req.user._id);
  }
}
