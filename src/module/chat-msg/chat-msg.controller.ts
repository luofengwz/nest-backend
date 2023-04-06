import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common'
import { ChatMsgService } from './chat-msg.service'
import { CreateChatMsgDto } from './dto/createChatMsg.dto'

@Controller('chatmsg')
export class ChatMsgController {
  constructor(private readonly chatMsgService: ChatMsgService) {}
  @Get('getByUserId')
  getMsgByUserId(@Query() query: { userId: number }) {
    return this.chatMsgService.getMsgByUserId(query.userId)
  }

  @Post('create')
  createMsg(@Param() param: CreateChatMsgDto) {
    return this.chatMsgService.createChatMsg(param)
  }

  @Get('getMessageList')
  getMessageList(@Query() query: { page: number; size: number; userId: number; toUserId: number }) {
    return this.chatMsgService.getMessageList(query)
  }
}
