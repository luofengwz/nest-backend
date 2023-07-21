import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('chat_msg')
export class ChatMsgEntity {
  @ApiProperty({ type: Number, description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: number

  @ApiProperty({ type: Number, description: '用户id' })
  @Column({ type: 'bigint', name: 'user_id', comment: '用户id',default: 0 })
  public userId: number

  @ApiProperty({ type: Number, description: '接收消息的用户id' })
  @Column({ type: 'bigint', name: 'receive_id', comment: '接收消息的用户id',default: 0 })
  public receiveId: number

  @ApiProperty({ type: Number, description: '房间id' })
  @Column({ type: 'bigint', name: 'room_id', comment: '房间id',default: 0 })
  public roomId: number

  @ApiProperty({ type: String, description: '消息内容' })
  @Column({
    type: 'text',
    comment: '消息内容',
  })
  public content: string

  @ApiProperty({ type: Number, description: '是否已读' })
  @Column({ type: 'int', name: 'is_read', comment: '是否已读', default: 0 })
  public isRead: number

  @ApiProperty({ type: Number, description: '是否发送成功' })
  @Column({ type: 'int', comment: '是否发送成功', default: 0 })
  public success: number

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
