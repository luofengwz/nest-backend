import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { ImageModule } from '../image/image.module'
import { extname, join } from 'path'
@Module({
  imports: [ImageModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}


// MulterModule.register({
//   storage:diskStorage({
//      destination:join(__dirname,"../../images"),
//      filename:(_,file,callback) => {
//         const fileName = `${new Date().getTime() + extname(file.originalname)}`
//         return callback(null,fileName)
//      }
//   })
// }),