import { NestWebSocketGateway } from './websocket.gateway'
import { Module, forwardRef } from '@nestjs/common'
import { UserModule } from '../user/user.module'
import { ChatMsgModule } from '../chat-msg/chat-msg.module'
@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => ChatMsgModule)],
  providers: [NestWebSocketGateway],
  exports: [NestWebSocketGateway],
})
export class WebSocketModule {}
