import { Request, Response, NextFunction } from 'express'
import gm from 'gm'
import path, { join } from 'path'

export function StaticResourceMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.url.startsWith('/static/')) {
    const url = req.url.split('?')[0]
    const ext = path.extname(url).replace('.','')
    const query = req.query
    const imageMagick = gm.subClass({ imageMagick: true })
    let imgMagick = imageMagick(join(__dirname, `../../../${url.replace('/static/images', '/upload')}`))
    if (query.w && query.h) {
      imgMagick.resize(Number(query.w), Number(query.h), '!') //设置压缩后的w/h
    }
    if (query.quality) {
      imgMagick.quality(Number(query.quality)) //设置压缩质量: 0-100
    }
    imgMagick.strip().toBuffer((err, buffer) => {
      console.log(ext)
      res.setHeader('Content-Type', `image/${ext}`)
      res.setHeader('Content-Disposition', 'inline')
      res.status(200).send(buffer)
    })

    // res.status(403).send('静态资源不可访问')
    // next()
  } else {
    next()
  }
}
