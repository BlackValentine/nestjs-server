import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/models/user.model';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { CategoryRepository } from '../repositories/category.repository';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  getAllPost() {
    return this.postRepository.getByCondition({});
  }

  getPostById(post_id: string) {
    const post = this.postRepository.findById(post_id);
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async replacePost(post_id: string, data: UpdatePostDto) {
    return await this.postRepository.findByConditionAndUpdate(post_id, data);
  }

  async createPost(user: User, post: CreatePostDto) {
    post.user = user._id;
    const new_post = await this.postRepository.create(post);
    if (post.categories) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: post.categories },
        },
        {
          $push: {
            posts: new_post._id,
          },
        },
      );
    }
    return new_post;
  }

  async getByCategory(category_id: string) {
    return await this.postRepository.getByCondition({
      categories: {
        $elemMatch: { $eq: category_id },
      },
    });
  }

  async getByCategories(category_ids: [string]) {
    return await this.postRepository.getByCondition({
      categories: {
        $all: category_ids,
      },
    });
  }

  async deletePost(post_id: string) {
    return await this.postRepository.deleteOne(post_id);
  }
}
