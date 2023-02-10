import { AccountService } from './service'
import { AuthGuard } from './decorator'
import { Controller, UseGuards } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import {
  CreateUserDTO,
  AuthUserDTO,
  AccessTokenDTO,
  RefreshTokenDTO,
  PasswordUpdateDTO,
  UsernameDTO,
  EmailDTO,
  EmailUpdateDTO,
  AvatarUpdate,
  UsernameUpdateDTO
} from './dto'


@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @MessagePattern({ cmd: 'createAccount' })
  createAccount(userData: CreateUserDTO) {
    return this.accountService.createAccount(userData)
  }

  @MessagePattern({ cmd: 'authAccount' })
  authAccount(userData: AuthUserDTO) {
    return this.accountService.authAccount(userData)
  }

  @MessagePattern({ cmd: 'checkAccessToken' })
  @UseGuards(AuthGuard)
  checkAccessToken({ access_token }: AccessTokenDTO) {
    return this.accountService.checkAccessToken(access_token)
  }

  @MessagePattern({ cmd: 'renewAccessToken' })
  renewAccessToken({ refresh_token }: RefreshTokenDTO) {
    return this.accountService.renewAccessToken(refresh_token)
  }

  @MessagePattern({ cmd: 'removeAccessToken' })
  @UseGuards(AuthGuard)
  removeAccessToken({ access_token }: AccessTokenDTO) {
    return this.accountService.removeAccessToken(access_token)
  }

  @MessagePattern({ cmd: 'updatePasswordAccount' })
  @UseGuards(AuthGuard)
  updatePasswordAccount(payload: PasswordUpdateDTO) {
    return this.accountService.updatePasswordAccount(
      payload.access_token,
      payload.password,
      payload.new_password,
      payload.confirm_password
    )
  }

  @MessagePattern({ cmd: 'checkAvalibleUsername' })
  checkAvalibleUsername(payload: UsernameDTO) {
    return this.accountService.checkAvalibleUsername(payload.username)
  }

  @MessagePattern({ cmd: 'updateUsernameAccount' })
  @UseGuards(AuthGuard)
  updateUsernameAccount(payload: UsernameUpdateDTO) {
    return this.accountService.updateUsernameAccount(
      payload.access_token, 
      payload.username
    )
  }

  @MessagePattern({ cmd: 'updateEmailAccount' })
  @UseGuards(AuthGuard)
  updateEmailAccount(payload: EmailUpdateDTO) {
    return this.accountService.updateEmailAccount(
      payload.access_token, 
      payload.email
    )
  }

  @MessagePattern({ cmd: 'checkAvalibleEmail' })
  checkAvalibleEmail({ email }: EmailDTO) {
    return this.accountService.checkAvalibleEmail(email)
  }

  @MessagePattern({ cmd: 'getSessions' })
  @UseGuards(AuthGuard)
  getSessions({ access_token }: AccessTokenDTO) {
    return this.accountService.getSessions(access_token)
  }

  @MessagePattern({ cmd: 'removeSessions' })
  @UseGuards(AuthGuard)
  removeSessions({ access_token }: AccessTokenDTO) {
    return this.accountService.removeSessions(access_token)
  }

  @MessagePattern({ cmd: 'uploadAvatar' })
  @UseGuards(AuthGuard)
  uploadAvatar(payload: AvatarUpdate) {
    return this.accountService.uploadAvatar(
      payload.access_token,
      payload.originalname,
      Buffer.from(payload.file),
      { 'Content-Type': payload.mimetype }
    )
  }

  @MessagePattern({ cmd: 'removeAvatar' })
  @UseGuards(AuthGuard)
  removeAvatar({ access_token }: AccessTokenDTO) {
    return this.accountService.removeAvatar(access_token)
  }
}
