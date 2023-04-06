import { NestWebSocketGateway } from './websocket.gateway'
import { Module } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { ChatMsgModule } from '../chat-msg/chat-msg.module'
@Module({
  imports: [UserModule, ChatMsgModule],
  providers: [NestWebSocketGateway],
  exports: [NestWebSocketGateway],
})
export class WebSocketModule {}
