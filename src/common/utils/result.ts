import { ApiProperty } from '@nestjs/swagger'
export class ResultData {
  constructor(code = 0, message?: string, data?: any) {
    this.code = code
    this.message = message || 'ok'
    this.data = data || null
  }

  @ApiProperty({ type: 'number', default: 0 })
  code: number

  @ApiProperty({ type: 'string', default: 'ok' })
  message?: string

  data?: any

  static ok(data?: any, message?: string): ResultData {
    return new ResultData(0, message, data)
  }

  static fail(code: number, message?: string, data?: any): ResultData {
    return new ResultData(code || 500, message || 'fail', data)
  }
}
