import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
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

  async getAllPost(page: number, limit: number, start: number) {
    const count = await this.postRepository.countDocuments({});
    const count_page = (count / limit).toFixed();
    const posts = await this.postRepository.getByCondition(
      {
        _id: {
          $gt: isValidObjectId(start) ? start : '00000000000000000000',
        },
      },
      null,
      {
        sort: {
          _id: 1,
        },
        skip: (Number(page) - 1) * Number(limit),
        limit: Number(limit),
      },
    );
    return {
      count_page,
      posts,
    };
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
