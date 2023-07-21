import { Body, Controller, Get, Inject, Param, Post, Query, Req } from '@nestjs/common'
import { ChatMsgService } from './chat-msg.service'
import { CreateChatMsgDto } from './dto/createChatMsg.dto'
import { NestWebSocketGateway } from '../websocket/websocket.gateway'

@Controller('chatmsg')
export class ChatMsgController {
  constructor(@Inject(NestWebSocketGateway) private readonly webscoket: NestWebSocketGateway, private readonly chatMsgService: ChatMsgService) {}
  @Get('getByUserId')
  getMsgByUserId(@Query() query: { userId: number }) {
    return this.chatMsgService.getMsgByUserId(query.userId)
  }

  @Post('create')
  createMsg(@Param() param: CreateChatMsgDto) {
    return this.chatMsgService.createChatMsg(param)
  }

  @Post('send')
  async sendMsg(@Body() param: CreateChatMsgDto) {
    console.log('参数：', param)
    const res = await this.chatMsgService.createChatMsg(param)
    this.webscoket.handleEmitRoomMessage({ ...res.data, user: param.user })
    return res
  }

  @Get('getMessageList')
  getMessageList(@Query() query: { page: number; size: number; userId: number; toUserId: number; roomId: number }) {
    return this.chatMsgService.getMessageList(query)
  }

  @Get('getRoomMessageList')
  getRoomMessageList(@Query() query: { page: number; size: number; roomId: number }) {
    return this.chatMsgService.getRoomMessageList(query)
  }
}
