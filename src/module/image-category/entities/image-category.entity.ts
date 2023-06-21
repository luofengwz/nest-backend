import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('image_category')
export class ImageCategoryEntity {
  @ApiProperty({ type: String, description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: number

  @ApiProperty({ type: String, description: '分类封面图片' })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '分类封面图片',
  })
  public cover: string

  @ApiProperty({ type: String, description: '分类名称' })
  @Column({ type: 'varchar', length: 100, comment: '分类名称' })
  public name: string

  @ApiProperty({ type: String, description: '分类描述' })
  @Column({ type: 'varchar', length: 200, comment: '分类描述' })
  public description: string

  @ApiProperty({
    type: Number,
    description: '是否禁用',
  })
  @Column({
    type: 'tinyint',
    default: 0,
    comment: '是否禁用',
  })
  public disabled: Number

  @ApiProperty({ type: Date, description: '创建时间' })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
    comment: '创建时间',
  })
  createDate: Date

  @ApiProperty({ type: Date, description: '更新时间' })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_date',
    comment: '更新时间',
  })
  updateDate: Date
}
