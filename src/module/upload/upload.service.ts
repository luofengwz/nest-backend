import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createWriteStream } from 'fs'
import { extname, join } from 'path'
import * as mkdirp from 'mkdirp';
import { format } from 'silly-datetime'; // 格式化日期


@Injectable()
export class UploadService {
  constructor(
    private readonly config: ConfigService
  ){}

  uploadFile(file) {
    /*
      1.获取当前日期
      2.根据日期创建目录 20210410
      3.实现上传
      4.返回图片保存的地址
    */
    // 1.获取当前日期
    let day = format(new Date(), 'YYYYMMDD') //目录名称
    let d = Date.now() // 时间戳，当前图片的名称
    // 2.创建保存文件的目录（按日期划分）
    let dir = join(__dirname, `${this.config.get('app.file.location')}`, day) // 保存图片的路径
    mkdirp.sync(dir) // 创建文件夹; (别忘了sync变成同步否则会报错，因为还没有创建日期文件夹)
    console.log(file)
    let filename = d + extname(file.originalname)
    // 3.实现上传
    let uploadDir = join(dir, filename)
    const writeImage = createWriteStream(uploadDir)
    writeImage.write(file.buffer)

    // 4.返回图片保存的地址
    let saveDir = join(this.config.get('app.file.location'), day, filename)
    console.log('返回图片保存的地址: ', saveDir) // upload/20210410/1618041629839.png
    return {filename,day, saveDir}
  }


}
