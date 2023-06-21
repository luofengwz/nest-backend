import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AdminImageCategoryService } from './image-category.service';
import { CreateImageCategoryDto } from '../dto/create-image-category.dto';
import { UpdateImageCategoryDto } from '../dto/update-image-category.dto';
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator';

@Controller('admin/imageCategory')
@AllowAnon()
export class AdminImageCategoryController {
  constructor(private readonly adminImageCategoryService: AdminImageCategoryService) {}

  // @Post()
  // create(@Body() createImageCategoryDto: CreateImageCategoryDto) {
  //   return this.adminImageCategoryService.create(createImageCategoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.adminImageCategoryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminImageCategoryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateImageCategoryDto: UpdateImageCategoryDto) {
  //   return this.imageCategoryService.update(+id, updateImageCategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.imageCategoryService.remove(+id);
  // }


  @Get('/getList')
  adminGetList(@Query() query: { page: number; size: number; type: number; order: String }) {
    return this.adminImageCategoryService.getList(query)
  }

  @Post('/add')
  add(@Body() createImageCategoryDto: CreateImageCategoryDto) {
    return this.adminImageCategoryService.create(createImageCategoryDto)
  }

  @Post('/update')
  update(@Body() updateImageCategoryDto: UpdateImageCategoryDto) {
    return this.adminImageCategoryService.update(updateImageCategoryDto)
  }

  @Delete('/delete')
  remove(@Query() idsObj: object) {
    let ids = []
    for (const key in idsObj) {
      ids.push(+idsObj[key])
    }
    return this.adminImageCategoryService.remove(ids)
  }
}
