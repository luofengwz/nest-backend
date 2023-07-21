import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

import express from 'express'

import { logger } from './common/libs/log4js/logger.middleware'
import { Logger } from './common/libs/log4js/log4j.util'
import { TransformInterceptor } from './common/libs/log4js/transform.interceptor'
import { HttpExceptionsFilter } from './common/libs/log4js/http-exceptions-filter'
import { ExceptionsFilter } from './common/libs/log4js/exceptions-filter'

import { NestExpressApplication } from '@nestjs/platform-express'
import { IoAdapter } from '@nestjs/platform-socket.io'

import Chalk from 'chalk'
import { getLocalIp } from './common/utils/utils'
import { join } from 'path'
import { StaticResourceMiddleware } from './middleware/static-resource-middleware'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  })
  // app.useGlobalGuards(new RoleGuard())

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  )

  app.useWebSocketAdapter(new IoAdapter(app)) // 使用websocket

  const config = app.get(ConfigService)
  // 设置 api 访问前缀
  const prefix = config.get<string>('app.prefix')
  app.setGlobalPrefix(prefix)

  // web 安全，防常见漏洞
  app.use(helmet())

  // 接口文档
  const swaggerOptions = new DocumentBuilder().setTitle('Nest App').setDescription('Nest App 接口文档').setVersion('1.0.0').addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  // 项目依赖当前文档功能，最好不要改变当前地址
  // 生产环境使用 nginx 可以将当前文档地址 屏蔽外部访问
  SwaggerModule.setup(`${prefix}/api-docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Nest API Docs',
  })

  // 日志
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(logger)
  app.use(StaticResourceMiddleware)
  // 使用全局拦截器打印出参
  app.useGlobalInterceptors(new TransformInterceptor())
  // 所有异常
  app.useGlobalFilters(new ExceptionsFilter())
  app.useGlobalFilters(new HttpExceptionsFilter())

  // 上传文件静态目录
  app.useStaticAssets(join(__dirname, '../../upload'), {
    prefix: config.get('app.file.serveRoot'),
  })

  // 获取配置端口
  const port = config.get<number>('app.port') || 8080

  await app.listen(port)

  const lIp = getLocalIp()
  Logger.log(
    Chalk.green(`Nest 服务启动成功 `),
    `http://${lIp}:${port}${prefix}/`,
    '\n',
    Chalk.green('swagger 文档地址 '),
    `http://localhost:${port}${prefix}/api-docs/`,
  )
  Logger.log(Chalk.green('websocket 服务启动成功'), `ws://${lIp}:8002/`)
}
bootstrap()
