import { Module, forwardRef } from '@nestjs/common';
import { ChatMsgController } from './chat-msg.controller';
import { ChatMsgService } from './chat-msg.service';
import { ChatMsgEntity } from './chat-msg.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebSocketModule } from '../websocket/websocket.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMsgEntity]),
    forwardRef(()=>WebSocketModule)
  ],
  controllers: [ChatMsgController],
  providers: [ChatMsgService],
  exports: [ChatMsgService]
})
export class ChatMsgModule {}
