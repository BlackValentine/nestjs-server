import { Module } from '@nestjs/common';
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
