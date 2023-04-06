import { UserType, StatusValue } from '../../../common/enums/common.enum'

export class CreateUserDto {
  avatar: string
  username: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  status: StatusValue
  type: UserType
}
