import { Module } from '@nestjs/common'
import { ImageCategoryService } from './image-category.service'
import { ImageCategoryController } from './image-category.controller'
import { AdminImageCategoryService } from './admin/image-category.service'
import { AdminImageCategoryController } from './admin/image-category.controller'
import { ImageCategoryEntity } from './entities/image-category.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ImageCategoryEntity])],
  controllers: [ImageCategoryController, AdminImageCategoryController],
  providers: [ImageCategoryService, AdminImageCategoryService],
  // exports: [ImageCategoryService],
})
export class ImageCategoryModule {}
