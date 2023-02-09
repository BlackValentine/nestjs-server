import {
  Body,
  CacheInterceptor,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostCommand } from '../commands/createPost.command';
import {
  CreatePostDto,
  PaginationPostDto,
  UpdatePostDto,
} from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { Cache } from 'cache-manager';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  // @Inject(CACHE_MANAGER) private cacheManager: Cache,

  @Get()
  getAllPost(@Query() { page, limit, start }: PaginationPostDto) {
    return this.postService.getAllPost(page, limit, start);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  // @Get(':id/get-with-cache')
  // @UseInterceptors(CacheInterceptor)
  // getPostByIdWithCache(@Param('id') id: string) {
  //   console.log('Run here');
  //   return this.postService.getPostById(id);
  // }

  // @Get('cache/demo/set-cache')
  // async demoSetCache() {
  //   await this.cacheManager.set('blackvalentine', 'hello world', {
  //     ttl: 60 * 10,
  //   });
  //   return true;
  // }

  // @Get('cache/demo/get-cache')
  // async demoGetCache() {
  //   return await this.cacheManager.get('blackvalentine');
  // }

  @Get(':id/get-by-query')
  async getPostByIdByQuery(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any, @Body() post: CreatePostDto) {
    return this.postService.createPost(req.user, post);
  }

  @Post('create-by-command')
  @UseGuards(AuthGuard('jwt'))
  async createByCommand(@Req() req: any, @Body() post: CreatePostDto) {
    return this.commandBus.execute(new CreatePostCommand(req.user, post));
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
