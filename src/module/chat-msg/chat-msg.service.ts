import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { ResultData } from 'src/common/utils/result'
import { DataSource, Repository } from 'typeorm'
import { ChatMsgEntity } from './chat-msg.entity'
import { CreateChatMsgDto } from './dto/createChatMsg.dto'

@Injectable()
export class ChatMsgService {
  constructor(
    @InjectRepository(ChatMsgEntity)
    private readonly chatMsgRepo: Repository<ChatMsgEntity>,
    private dataSource: DataSource,
  ) {}


  async getMsgByUserId(userId: number) {
    const list = await this.chatMsgRepo.find({ where: { userId } })
    return ResultData.ok(list)
  }

  async createChatMsg(chatMsgDto: CreateChatMsgDto) {
    const chatMsg: ChatMsgEntity = plainToInstance(ChatMsgEntity, chatMsgDto)
    const result = await this.chatMsgRepo.save<ChatMsgEntity>(chatMsg)
    return ResultData.ok(result)
  }

  // 获取好友列表

  // 修改消息状态
  async setReadMsg(chatMsg: ChatMsgEntity) {
    const result = await this.chatMsgRepo.save<ChatMsgEntity>(chatMsg)
    return ResultData.ok(result)
  }

  // 一键消息已读
  async readAllMsg(userId: number) {
    const result = await this.chatMsgRepo.update({ userId }, { isRead: 1 })
    return ResultData.ok(result)
  }

  // 获取用户最新一条消息
  async getLastMsgByUserId(userId: number) {
    const result = await this.dataSource
      .createQueryRunner()
      .query(`select id,content,create_date from chat_msg where receive_id = ${userId} order by id desc limit 0,1`)
    // const result = await this.chatMsgRepo.findBy({ userId })
    return ResultData.ok(result)
  }

  // 获取消息列表
  async getMessageList({ page, size, userId, toUserId }) {
    //  select * from chat_msg where user_id=${userId} and receive_id=${toUserId} order by id desc limit ${(page - 1) * size},${size}
    const result = await this.dataSource.createQueryRunner().query(` SELECT c.id, JSON_EXTRACT(c.content,'$') as content, 
      JSON_OBJECT('id', u1.id, 'avatar', u1.avatar, 'username', u1.username) AS user,
      JSON_OBJECT('id', u2.id, 'avatar', u2.avatar, 'username', u2.username) AS toUser
      FROM chat_msg c
      JOIN user u1 ON c.user_id = u1.id
      JOIN user u2 ON c.receive_id = u2.id
      WHERE (c.user_id = ${userId} AND c.receive_id = ${toUserId})
      OR (c.user_id = ${toUserId} AND c.receive_id = ${userId})
      ORDER BY c.id DESC
      LIMIT ${(page - 1) * size},${size};`)
    if(result instanceof Array){
      result.reverse()
    }
    return ResultData.ok(result)
  }
}
