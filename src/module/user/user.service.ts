import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateTokenDto } from './dto/create-token.dto'
import { ConfigService } from '@nestjs/config'
import { UserEntity } from './entities/user.entity'
import ms from 'ms'

import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Like, Repository, In, EntityManager, DataSource } from 'typeorm'

import { instanceToPlain, plainToInstance } from 'class-transformer'
import { genSalt, hash, compare, genSaltSync, hashSync } from 'bcryptjs'

import { UserRoleService } from './role/user-role.service'

import { getRedisKey } from '../../common/utils/utils'
import { RedisService } from '../../common/libs/redis/redis.service'
import { ResultData } from '../../common/utils/result'
import { AppHttpCode } from '../../common/enums/code.enum'
import { RedisKeyPrefix } from '../../common/enums/redis-key-prefix.enum'
import { validPhone, validEmail } from '../../common/utils/validate'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectEntityManager()
    private readonly userManager: EntityManager,
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRoleService,
    private dataSource: DataSource,
  ) {}

  /**
   * 创建用户
   * @param dto
   * @returns
   */
  async create(dto: CreateUserDto): Promise<ResultData> {
    if (dto.password !== dto.confirmPassword) return ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '两次输入密码不一致，请重试')
    // 防止重复创建 start
    console.log(dto.phone)
    if (await this.userRepo.findOne({ where: { phone: dto.phone } }))
      return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前手机号已存在，请调整后重新注册')
    if (await this.userRepo.findOne({ where: { email: dto.email } }))
      return ResultData.fail(AppHttpCode.USER_CREATE_EXISTING, '当前邮箱已存在，请调整后重新注册')
    // 防止重复创建 end
    const salt = await genSalt()
    dto.password = await hash(dto.password, salt) //密码加盐
    // plainToInstance  忽略转换 @Exclude 装饰器
    const user = plainToInstance(UserEntity, { salt, ...dto }, { ignoreDecorators: true })
    const result = await this.userManager.transaction(async (transactionalEntityManager) => {
      return await transactionalEntityManager.save<UserEntity>(user)
    })
    return ResultData.ok(instanceToPlain(result))
  }

  /**
   * 登录
   * 有可能是 手机/邮箱
   */
  async login(account: string, password: string): Promise<ResultData> {
    let user = null
    if (validPhone(account)) {
      // 手机登录
      user = await this.userRepo.findOne({ where: { phone: account } })
    } else if (validEmail(account)) {
      // 邮箱
      user = await this.userRepo.findOne({ where: { email: account } })
    } else {
      // 用户名
      user = await this.userRepo.findOne({ where: { username: account } })
      // return ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '账号格式错误')
    }
    if (!user) return ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '帐号或密码错误')
    const checkPassword = await compare(password, user.password)
    if (!checkPassword) return ResultData.fail(AppHttpCode.USER_PASSWORD_INVALID, '帐号或密码错误')
    if (user.status === 0) return ResultData.fail(AppHttpCode.USER_ACCOUNT_FORBIDDEN, '您已被禁用，如需正常使用请联系管理员')
    // 生成 token
    const data = this.genToken({ id: user.id })
    console.log('正常返回')
    return ResultData.ok(data)
  }

  async findAll(): Promise<UserEntity[]> {
    const fields = {
      id: null,
      username: null,
      avatar: null,
      phone: null,
      email: null,
      status: null,
      type: null,
    }
    const userList = await this.userRepo.createQueryBuilder().setFindOptions({ select: fields }).getMany()
    return userList
  }

  // 获取用户列表 包含未读消息数量
  //   select `user`.id,`user`.username,`user`.avatar, (SELECT content FROM chat_msg WHERE chat_msg.user_id=1 ORDER BY id DESC LIMIT 1) as content, count(`user`.id) as total from `user` LEFT JOIN `chat_msg`
  // ON `chat_msg`.user_id=`user`.id AND chat_msg.is_read=0 AND chat_msg.receive_id=1 GROUP BY `user`.id;
  async getUserList(userId: number) {
    const queryStr = `SELECT u.id,u.avatar,u.username,u.phone,x.un_read,
    (SELECT JSON_EXTRACT(content,'$') FROM chat_msg c WHERE (u.id=c.user_id or u.id=c.receive_id) AND (${userId}=c.receive_id or ${userId}=c.user_id) ORDER BY id DESC LIMIT 1) as content 
    from user u left join
    (SELECT count(1) un_read, user_id from chat_msg where is_read=0 AND receive_id=${userId} GROUP BY user_id) x 
    ON u.id = x.user_id`
    // const queryStr = `select user.id,user.username,user.avatar,(SELECT content FROM chat_msg WHERE chat_msg.user_id=user.id AND chat_msg.receive_id=${userId} ORDER BY id DESC LIMIT 1) as content,count(*) as total from user LEFT JOIN chat_msg
    // ON chat_msg.user_id=user.id AND chat_msg.is_read=0 AND chat_msg.receive_id=${userId} GROUP BY chat_msg.user_id`
    const queryRunner = this.dataSource.createQueryRunner()
    const list = await queryRunner.query(queryStr)
    await queryRunner.release()
    return list
  }

  async findOne(id: string): Promise<ResultData> {
    let user = await this.findOneById(id)
    return ResultData.ok(user)
  }

  async findOneById(id: string): Promise<UserEntity> {
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, id)
    const result = await this.redisService.hGetAll(redisKey)
    // plainToInstance 去除 password slat
    let user = plainToInstance(UserEntity, result, {
      enableImplicitConversion: true,
    })
    if (!user?.id) {
      user = await this.userRepo.findOne({ where: { id } })
      user = plainToInstance(UserEntity, { ...user }, { enableImplicitConversion: true })
      await this.redisService.hmset(redisKey, instanceToPlain(user), ms(this.config.get<string>('jwt.expiresin')) / 1000)
    }
    user.password = ''
    user.salt = ''
    return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }

  /**
   * 生成 token 与 刷新 token
   * @param payload
   * @returns
   */
  genToken(payload: { id: string }): CreateTokenDto {
    const token = `Bearer ${this.jwtService.sign(payload)}`
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('jwt.refreshExpiresIn'),
    })
    return { token, refreshToken }
  }
  async updateToken(userId: string): Promise<ResultData> {
    const data = this.genToken({ id: userId })
    return ResultData.ok(data)
  }

  /**
   * 生成刷新 token
   */
  refreshToken(id: string): string {
    return this.jwtService.sign({ id })
  }

  /** 校验 token */
  verifyToken(token: string): string {
    try {
      if (!token) return null
      const verInfo = this.jwtService.verify(token.replace('Bearer ', ''))
      return verInfo ? verInfo.id : null
    } catch (error) {
      return null
    }
  }
}
