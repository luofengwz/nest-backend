import { Injectable } from '@nestjs/common'
import { CreateImageCategoryDto } from '../dto/create-image-category.dto'
import { UpdateImageCategoryDto } from '../dto/update-image-category.dto'
import { ResultData } from 'src/common/utils/result'
import { ImageCategoryEntity } from '../entities/image-category.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AdminImageCategoryService {
  constructor(
    @InjectRepository(ImageCategoryEntity)
    private readonly imageCategoryRepo: Repository<ImageCategoryEntity>,
  ) {}

  // findAll() {
  //   return `This action returns all imageCategory`
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} imageCategory`
  // }

  // update(id: number, updateImageCategoryDto: UpdateImageCategoryDto) {
  //   return `This action updates a #${id} imageCategory`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} imageCategory`;
  // }

  async create(createImageCategoryDto: CreateImageCategoryDto) {
    const res = await this.imageCategoryRepo.save(createImageCategoryDto)
    return ResultData.ok(res)
  }

  async getList(query) {
    const createQueryBuilder = this.imageCategoryRepo.createQueryBuilder() //.where("disabled = :disabled", { disabled: 0 })
    const res = await createQueryBuilder
      .skip((query.page - 1) * query.size)
      .take(query.size)
      .addOrderBy('create_date', query.order || 'DESC')
      .getMany()

    const total = await createQueryBuilder.getCount()
    return ResultData.ok({ list: res, total })
  }

  async update(updateImageDto: CreateImageCategoryDto) {
    const res = await this.imageCategoryRepo.save(updateImageDto)
    return ResultData.ok(res)
  }

  async remove(ids: number[]) {
    const res = await this.imageCategoryRepo.delete(ids)
    return ResultData.ok(res)
  }
}
