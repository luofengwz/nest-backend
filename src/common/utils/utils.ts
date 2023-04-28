import { RedisKeyPrefix } from '../enums/redis-key-prefix.enum'
/**
 * 获取 模块前缀与唯一标识 整合后的 redis key
 * @param moduleKeyPrefix 模块前缀
 * @param id id 或 唯一标识
 */
export function getRedisKey(moduleKeyPrefix: RedisKeyPrefix, id: string | number): string {
  return `${moduleKeyPrefix}${id}`
}

export function getLocalIp() {
  const interfaces = require('os').networkInterfaces() //服务器本机地址
  let IPAdress = ''
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        IPAdress = alias.address
      }
    }
  }
  return IPAdress
}
