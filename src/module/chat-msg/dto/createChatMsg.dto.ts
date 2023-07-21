export class CreateChatMsgDto {
  userId: number // 发送对象
  receiveId: number //接收对象
  isRead: number //是否已读
  success: number //是否发送成功
  content: string //发送内容
  user?: object
}

// 消息内容
export interface msgContent {
  text: string //文字消息
  images?: [] //图片
  annex?: [] //附件
}
