import { Injectable } from '@nestjs/common';
import { CreateImageCategoryDto } from './dto/create-image-category.dto';
import { UpdateImageCategoryDto } from './dto/update-image-category.dto';

@Injectable()
export class ImageCategoryService {
  create(createImageCategoryDto: CreateImageCategoryDto) {
    return 'This action adds a new imageCategory';
  }

  findAll() {
    return `This action returns all imageCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageCategory`;
  }

  update(id: number, updateImageCategoryDto: UpdateImageCategoryDto) {
    return `This action updates a #${id} imageCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageCategory`;
  }
}
