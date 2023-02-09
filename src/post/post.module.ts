import { CacheModule, Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostRepository } from './repositories/post.repository';
import { CategoryController } from './controllers/category.controller';
import { CategorySchema } from './models/category.model';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './handlers/createPost.handler';
import { GetPostHandler } from './handlers/getPost.handler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
    ]),
    CqrsModule,
    // CacheModule.register({
    //   ttl: 10,
    // }),
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => ({
    //     // isGlobal: true,
    //     store: redisStore,
    //     host: configService.get<string>('REDIS_HOST'),
    //     port: configService.get<number>('REDIS_PORT'),
    //     username: configService.get<string>('REDIS_USERNAME'),
    //     password: configService.get<string>('REDIS_PASSWORD'),
    //   }),
    // }),
  ],
  controllers: [PostController, CategoryController],
  providers: [
    PostService,
    PostRepository,
    CategoryService,
    CategoryRepository,
    CreatePostHandler,
    GetPostHandler,
  ],
})
export class PostModule {}
