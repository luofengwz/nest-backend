
import { Controller, Get, Post, Body, Patch, Param, Delete,UseInterceptors,UploadedFile } from '@nestjs/common';
import { UploadService } from './upload.service';
import {FileInterceptor} from '@nestjs/platform-express'
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';
import { ImageService } from '../image/image.service';
import { CreateImageDto } from '../image/dto/create-image.dto';
import { ConfigService } from '@nestjs/config';
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly imageService: ImageService,
    private readonly config: ConfigService
  ) {}
  
  @Post('album')
  @AllowAnon()
  @UseInterceptors(FileInterceptor('file'))
  upload (@UploadedFile() file) {
    const uFile = this.uploadService.uploadFile(file)
    const path = `${this.config.get('app.file.serveRoot')}/${uFile.day}/${uFile.filename}`
    const image : CreateImageDto = {
      path: path,
      fullPath: this.config.get('app.file.domain') + path,
      filename: uFile.filename,
      description: '系统上传',
      type: 1
    }
    return this.imageService.create(image)
  }
}