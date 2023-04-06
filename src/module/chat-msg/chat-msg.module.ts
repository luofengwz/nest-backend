import { Module } from '@nestjs/common';
import { ChatMsgController } from './chat-msg.controller';
import { ChatMsgService } from './chat-msg.service';
import { ChatMsgEntity } from './chat-msg.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMsgEntity]),
  ],
  controllers: [ChatMsgController],
  providers: [ChatMsgService],
  exports: [ChatMsgService]
})
export class ChatMsgModule {}
