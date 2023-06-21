import { Injectable } from '@nestjs/common'
import { CreateImageDto } from '../dto/create-image.dto'
import { UpdateImageDto } from '../dto/update-image.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ImageEntity } from '../entities/image.entity'
import { Repository } from 'typeorm'
import { ResultData } from 'src/common/utils/result'

@Injectable()
export class AdminImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
  ) {}
  async create(createImageDto: CreateImageDto) {
    const res = await this.imageRepo.save(createImageDto)
    return ResultData.ok(res)
  }

  findAll() {
    return `This action returns all image`
  }

  findOne(id: number) {
    return `This action returns a #${id} image`
  }

  async getList(query) {
    const createQueryBuilder = this.imageRepo.createQueryBuilder()//.where("disabled = :disabled", { disabled: 0 })
    const res = await createQueryBuilder
      .skip((query.page - 1) * query.size)
      .take(query.size)
      .addOrderBy('create_date', query.order || 'DESC')
      .getMany()

    const total = await createQueryBuilder.getCount()
    return ResultData.ok({ list: res, total })
  }

  async update(updateImageDto: UpdateImageDto) {
    const res = await this.imageRepo.save(updateImageDto)
    return ResultData.ok(res)
  }

  async remove(ids: number[]) {
    const res = await this.imageRepo.delete(ids)
    return ResultData.ok(res)
  }
}
