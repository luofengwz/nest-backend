import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { AdminImageService } from './image.service'
import { CreateImageDto } from '../dto/create-image.dto'
import { UpdateImageDto } from '../dto/update-image.dto'
import { AllowAnon } from 'src/common/decorators/allow-anon.decorator'

@Controller('admin/image')
@AllowAnon()
export class AdminImageController {
  constructor(private readonly imageService: AdminImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto)
  }

  @Get('/getList')
  adminGetList(@Query() query: { page: number; size: number; type: number; order: String }) {
    return this.imageService.getList(query)
  }

  @Post('/update')
  update(@Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(updateImageDto)
  }

  @Delete('/delete')
  remove(@Query() idsObj: object) {
    let ids = []
    for (const key in idsObj) {
      ids.push(+idsObj[key])
    }
    return this.imageService.remove(ids)
  }

}
