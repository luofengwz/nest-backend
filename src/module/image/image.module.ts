import { Module } from '@nestjs/common'
import { ImageService } from './image.service'
import { ImageController } from './image.controller'
import { AdminImageController } from './admin/image.controller'
import { AdminImageService } from './admin/image.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ImageEntity } from './entities/image.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  controllers: [ImageController, AdminImageController],
  providers: [ImageService, AdminImageService],
  exports: [ImageService],
})
export class ImageModule {}
