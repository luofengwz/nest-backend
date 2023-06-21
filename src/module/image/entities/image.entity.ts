import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('image')
export class ImageEntity {
  @ApiProperty({ type: String, description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: number;

  @ApiProperty({ type: String, description: '图片路径' })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: '图片路径',
  })
  public path: string;

  @ApiProperty({ type: String, description: '图片路径完整路径' })
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: '图片路径完整路径',
  })
  public fullPath: string;

  @ApiProperty({ type: String, description: '文件名' })
  @Column({ type: 'varchar',length: 100, comment: '文件名' })
  public filename: string;

  @ApiProperty({ type: String, description: '用户名' })
  @Column({ type: 'varchar',length: 100, comment: '图片描述' })
  public description: string;
  
  
  @ApiProperty({
    type: Number,
    description: '图片分类ID'
  })
  @Column({
    type: 'tinyint',
    default: 1,
    comment: '图片分类ID',
  })
  public imageCategoryId: Number;

  @ApiProperty({
    type: Number,
    description: '图片分类'
  })
  @Column({
    type: 'tinyint',
    default: 1,
    comment: '图片分类',
  })
  public type: Number;

  @ApiProperty({
    type: Number,
    description: '是否禁用'
  })
  @Column({
    type: 'tinyint',
    default: 0,
    comment: '是否禁用',
  })
  public disabled: Number;

  @ApiProperty({ type: Date, description: '创建时间' })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
    comment: '创建时间',
  })
  createDate: Date;

  @ApiProperty({ type: Date, description: '更新时间' })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_date',
    comment: '更新时间',
  })
  updateDate: Date;
}
