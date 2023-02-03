import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';

export class PostNotFoundException extends HttpException {
  constructor(postId: string) {
    super(`Post with id ${postId} not found`, HttpStatus.NOT_FOUND);
  }
}
