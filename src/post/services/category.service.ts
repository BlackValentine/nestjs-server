import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category.dto';
import { CategoryRepository } from '../repositories/category.repository';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAll() {
    return await this.categoryRepository.getByCondition({});
  }

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.create(createCategoryDto);
  }

  async getPosts(category_id: string) {
    return await this.postRepository.getByCondition({
      categories: { $elemMatch: { $eq: category_id } },
    });
  }
}
