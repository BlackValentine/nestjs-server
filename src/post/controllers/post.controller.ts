import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostService } from '../services/post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any, @Body() post: CreatePostDto) {
    return this.postService.createPost(req.user, post);
  }

  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postService.replacePost(id, post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    this.postService.deletePost(id);
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/all')
  async getPostUser(@Req() req: any) {
    await req.user.populate('posts').execPopulate();
    return req.user.posts;
  }
}
