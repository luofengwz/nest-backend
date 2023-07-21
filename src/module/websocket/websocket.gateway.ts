import { Inject } from '@nestjs/common'
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
// 导入用户模块
import { UserService } from '../user/user.service'
import { ChatMsgService } from '../chat-msg/chat-msg.service'
import { message, msgContent } from './types/websocket'

/**
 * Gateway是一个用@WebSocketGateway()装饰器注释的类。网关使用了socket.io包，但也提供了与各种其他库的兼容性，包括本机Web套接字实现
 *  yarn add @nestjs/websockets @nestjs/platform-socket.io @types/socket.io -D
 * 通常，每个网关都在侦听与运行HTTP服务器相同的端口，除非您的应用程序不是Web应用程序，或者您已手动更改了端口。
 * 我们可以通过将参数传递给@WebSocketGateway(8080)装饰器来更改此行为，其中8080所选择的端口号。
 */
@WebSocketGateway(8002, {
  // namespace: '/room',
  allowEIO3: true,
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class NestWebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  wsClients = new Map() //链接的数量
  messageQuqu = {} // 未发送消息列表
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(ChatMsgService)
    private readonly chatMsgService: ChatMsgService,
  ) {}
  afterInit(server: Server) {
    console.log('init')
    this.server = server
  }
  // 连接
  handleConnection(client: Socket) {
    console.log(`Client Connection: 用户${client.handshake.query.userId}连接`)
    this.wsClients.set(client.handshake.query.userId, client)
  }
  // 关闭
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: 用户${client.handshake.query.userId}离开`)
    this.wsClients.delete(client.handshake.query.userId)
  }

  // 用户单聊 连接用户
  @SubscribeMessage('singleChat')
  handleSingleChat(client: Socket, data) {
    if (this.messageQuqu[data.userId]) {
      let ws = this.wsClients.get(data.userId)
      this.messageQuqu[data.userId].forEach((item) => {
        item.isRead = 1 //消息已读
        ws.emit('singleChatMessage', item, () => {
          this.chatMsgService.setReadMsg(item)
        })
      })
      // 消息已读
      const r = this.chatMsgService.readAllMsg(data.userId)
      console.log('1111111', r)
      this.messageQuqu[data.userId] = []
    }
    return { data, ws: this.wsClients.entries() }
  }
  // 用户单聊传递消息
  @SubscribeMessage('singleChatMessage')
  handleSingleChatMessage(client: Socket, data) {
    data.success = 1 //消息发送成功
    // 存数据库
    this.saveToTable(data).then((res) => {
      if (this.wsClients.has(data.toUser.id)) {
        let ws = this.wsClients.get(data.toUser.id)
        console.log(this.wsClients)
        ws.timeout(5000).emit('singleChatMessage', data, (err, response) => {
          if (err) {
            console.log(err)
            this.saveMessageQueque(res.data)
          } else {
            let item = res.data
            item.isRead = 1 //消息已读
            console.log('消息：', item)
            this.chatMsgService.setReadMsg(item)
          }
        })
      } else {
        this.saveMessageQueque(res.data)
      }
    })
    return data
  }

  // 对方不在线 存队列
  saveMessageQueque(data) {
    if (!this.messageQuqu[data.receive_id]) this.messageQuqu[data.receive_id] = []
    this.messageQuqu[data.receive_id].push(data)
    console.log('对方不在线')
  }

  // @SubscribeMessage('message')
  // public handleMessage(client: Socket, data: message) {
  //   // client.broadcast
  //   // this.broadcast(data)
  //   this.wsClients.get(data.roomId).send(data)
  //   return data
  //   // throw new WsException('Invalid credentials.'); // 抛出的异常
  // }
  // 广播消息
  private broadcast(message: any) {
    for (let [key, value] of this.wsClients) {
      if (value.userId === message.toUser.id || value.userId === message.user.id) {
        value.send(message)
      }
    }
  }

  // 获取用户列表
  @SubscribeMessage('getUserList')
  async handleGetUserList(client: Socket, data: unknown) {
    const userId = Number(client.handshake.query.userId)
    const user = await this.userService.getUserList(userId)
    return user
  }
  // 消息存数据库
  saveToTable(data) {
    return this.chatMsgService.createChatMsg({
      userId: data.user.id,
      receiveId: data.toUser.id,
      content: JSON.stringify(data.content),
      isRead: data.isRead,
      success: data.success,
    })
  }

  // 加入房间
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload) {
    console.log(payload)
    client.join(payload.roomId)
    client.emit('joinRoom', payload.roomId)
    return payload.roomId
  }

  // 离开房间
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload) {
    client.leave(payload.roomId)
    client.emit('leaveRoom', payload.roomId)
    return payload.roomId
  }

  // 给房间用户推送消息
  handleEmitRoomMessage(data) {
    console.log('推送事件')
    this.server.emit('roomMessage', data)
  }
}
