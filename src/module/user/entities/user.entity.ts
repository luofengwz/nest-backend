import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer'
import { $enum } from 'ts-enum-util'
import { UserType, StatusValue } from '../../../common/enums/common.enum'

@Entity('user')
export class UserEntity {
  @ApiProperty({ type: String, description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: number;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽密码
  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    comment: '用户登录密码',
  })
  public password: string;

  @Exclude({ toPlainOnly: true }) // 输出屏蔽盐
  @Column({ type: 'varchar', length: 200, nullable: false, comment: '盐' })
  public salt: string;

  @ApiProperty({ type: String, description: '用户名' })
  @Column({ type: 'varchar',length: 20, comment: '用户名' })
  public username: string;

  @ApiProperty({ type: String, description: '头像url' })
  @Column({ type: 'varchar', comment: '头像地址' })
  public avatar: string;

  @ApiProperty({ type: String, description: '手机号' })
  @Column({
    type: 'varchar',
    name: 'phone',
    default: '',
    length: 20,
    comment: '用户手机号码',
  })
  public phone: string;

  @ApiProperty({ type: String, description: '邮箱' })
  @Column({ type: 'varchar', comment: '邮箱地址', default: '' })
  public email: string;

  @ApiProperty({
    type: String,
    description: '所属状态: 1-有效，0-禁用',
    enum: $enum(StatusValue).getValues(),
  })
  @Column({
    type: 'tinyint',
    default: StatusValue.NORMAL,
    comment: '所属状态: 1-有效，0-禁用',
  })
  public status: StatusValue;

  @ApiProperty({
    type: Number,
    description: '帐号类型：0-超管， 1-普通用户',
    enum: $enum(UserType).getValues(),
  })
  @Column({
    type: 'tinyint',
    default: UserType.ORDINARY_USER,
    comment: '帐号类型：0-超管， 1-普通用户',
  })
  public type: UserType;

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
