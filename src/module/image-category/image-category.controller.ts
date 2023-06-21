import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImageCategoryService } from './image-category.service';
import { CreateImageCategoryDto } from './dto/create-image-category.dto';
import { UpdateImageCategoryDto } from './dto/update-image-category.dto';

@Controller('imageCategory')
export class ImageCategoryController {
  constructor(private readonly imageCategoryService: ImageCategoryService) {}

  @Post()
  create(@Body() createImageCategoryDto: CreateImageCategoryDto) {
    return this.imageCategoryService.create(createImageCategoryDto);
  }

  @Get()
  findAll() {
    return this.imageCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageCategoryDto: UpdateImageCategoryDto) {
    return this.imageCategoryService.update(+id, updateImageCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageCategoryService.remove(+id);
  }
}
