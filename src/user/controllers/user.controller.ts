import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../dto/user.dto';

@Controller('user')
export class UserController {
  // @UseGuards(AuthGuard())
  @UseGuards(AuthGuard('jwt-two-factor'))
  @Get('profile')
  async getProfile(@Req() req: any): Promise<UserDto> {
    const user = await req.user;
    return plainToClass(UserDto, user, { excludeExtraneousValues: true });
  }
}
