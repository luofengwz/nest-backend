// 消息对象
export interface message {
  // event: string  //事件类型
  roomId: string,
  user: object; // 发送对象
  toUser: object | any; //接收对象
  isRead: boolean; //是否已读
  success: boolean; //是否发送成功
  content: msgContent; //发送内容
}

// 消息内容
export interface msgContent {
  text: string; //文字消息
  images?: array; //图片
  annex?: array; //附件
}
