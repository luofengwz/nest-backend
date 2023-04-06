import { ApiProperty } from '@nestjs/swagger'
export class ResultData {
  constructor(code = 0, message?: string, result?: any) {
    this.code = code
    this.message = message || 'ok'
    this.result = result || null
  }

  @ApiProperty({ type: 'number', default: 0 })
  code: number

  @ApiProperty({ type: 'string', default: 'ok' })
  message?: string

  result?: any

  static ok(result?: any, message?: string): ResultData {
    return new ResultData(0, message, result)
  }

  static fail(code: number, message?: string, result?: any): ResultData {
    return new ResultData(code || 500, message || 'fail', result)
  }
}
