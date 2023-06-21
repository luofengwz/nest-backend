import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';

@Controller('image')
@AllowAnon()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }
  
  @Get('/getList')
  getList(@Query() query: { page: number; size: number; type: number, order: String, key: String}) {
    return this.imageService.getList(query);
  }

}
