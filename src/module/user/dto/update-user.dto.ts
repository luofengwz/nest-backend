import { StatusValue, UserType } from "src/common/enums/common.enum"

export class UpdateUserDto {
  avatar: string
  username: string
  phone: string
  email: string
  status: StatusValue
  type: UserType

}
