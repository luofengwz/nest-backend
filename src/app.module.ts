import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisClientOptions } from '@liaoliaots/nestjs-redis'
import { APP_GUARD } from '@nestjs/core'
import configuration from './config/index'
import { RoleGuard } from './common/guard/role.guard'
import { JwtAuthGuard } from './common/guard/auth.guard'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from './common/libs/redis/redis.module'
import { AuthModule } from './module/auth/auth.module'
import { UserModule } from './module/user/user.module'
// websocket
import { WebSocketModule } from './module/websocket/websocket.module'
import { ChatMsgModule } from './module/chat-msg/chat-msg.module';
import { ImageModule } from './module/image/image.module';
import { UploadModule } from './module/upload/upload.module';
import { ImageCategoryModule } from './module/image-category/image-category.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          // 可能不再支持这种方式，entities 将改成接收 实体类的引用
          name: 'default',
          // entities: [`${__dirname}/**/*.entity{.ts,.js}`],
          autoLoadEntities: true,
          keepConnectionAlive: true,
          ...config.get('db.mysql'),
          // cache: {
          //   type: 'ioredis',
          //   ...config.get('redis'),
          //   alwaysEnabled: true,
          //   duration: 3 * 1000, // 缓存3s
          // },
        } as TypeOrmModuleOptions
      },
    }),
    // libs redis
    RedisModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          return {
            closeClient: true,
            config: config.get<RedisClientOptions>('redis'),
          }
        },
      },
      true,
    ),
    AuthModule,
    UserModule,
    ChatMsgModule,
    WebSocketModule,
    ImageModule,
    UploadModule,
    ImageCategoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
