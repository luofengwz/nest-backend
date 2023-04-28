import { Injectable } from '@nestjs/common'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ImageEntity } from './entities/image.entity'
import { Repository } from 'typeorm'
import { ResultData } from 'src/common/utils/result'

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
  ) {}
  async create(createImageDto: CreateImageDto) {
    const res = await this.imageRepo.save(createImageDto)
    return ResultData.ok(res)
  }

  async getList(query) {
    const res = await this.imageRepo
      .createQueryBuilder()
      .skip((query.page - 1) * query.size)
      .take(query.size)
      .getMany()
    console.log(res)
    return ResultData.ok(res)
  }

  findAll() {
    return `This action returns all image`
  }

  findOne(id: number) {
    return `This action returns a #${id} image`
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`
  }

  remove(id: number) {
    return `This action removes a #${id} image`
  }
}
