import { CreateUserDTO, AuthUserDTO } from './dto'
import type {
  AccountType,
  SessionType,
  StatusType,
  SessionDescType,
  FileURLType,
} from './type'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op } from 'sequelize'
import { User, Session, Avatar } from './entity'
import { dateWithOffset, generateToken } from 'utils'
import { createException } from './exception'
import { FileService } from 'file/service'
import * as bcrypt from 'bcrypt'


@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User, 'account') private userModel: typeof User,
    @InjectModel(Session, 'account') private sessionModel: typeof Session,
    @InjectModel(Avatar, 'account') private avatarModel: typeof Avatar,
    private fileService: FileService
  ) {}

  async checkExistEmail(email: string): Promise<boolean> {
    return (await this.userModel.findOne({ where: { email: email } })) !== null
  }

  async checkAvalibleEmail(email: string): Promise<StatusType> {
    if (!(await this.checkExistEmail(email))) {
      return { status: 'ok' }
    }
    createException('email_exist')
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ 
      where: { 
        email: email 
      },
      include: [ this.avatarModel ] 
    })
  }

  async getAvatarById(id: number): Promise<string | null> {
    const avatar = await this.avatarModel.findOne({ where: { userId: id } })
    if (avatar) {
      return [process.env.MINIO_PUBLIC_URL, avatar.url].join('')
    }
    else {
      return null
    }
  }

  async checkAvalibleUsername(username: string): Promise<StatusType> {
    if (!await this.checkExistUsername(username)) {
      return { status: 'ok' }
    }
    createException('username_exist')
  }

  async checkExistUsername(username: string): Promise<boolean> {
    return (
      (await this.userModel.findOne({ where: { username: username } })) !== null
    )
  }

  async hashingPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  async checkAccessToken(accessToken: string): Promise<AccountType> {
    const session = await this.getSessionByAccessToken(accessToken)
    return {
      id: session.user.id,
      username: session.user.username,
      email: session.user.email,
      avatar: await this.getAvatarById(session.userId),
      roles: session.user.roles
    }
  }

  async renewAccessToken(refreshToken: string): Promise<SessionType> {
    const session = await this.sessionModel.findOne({
      where: { refreshToken: refreshToken },
      include: [{ model: this.userModel }, ],
    })
    if (session === null) {
      createException('unauthorization')
    }
    if (session.expireRefreshToken < new Date()) {
      createException('expire')
    }

    session.accessToken = generateToken(256)
    session.refreshToken = generateToken(256)
    session.expireAccessToken = dateWithOffset(1)
    session.expireRefreshToken = dateWithOffset(30)
    await session.save()
    return {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      access_token_expire: session.expireAccessToken,
      refresh_token_expire: session.expireRefreshToken,
      user: {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
        avatar: await this.getAvatarById(session.userId),
        roles: session.user.roles
      }
    }
  }

  async createSession(userId: number): Promise<Session> {
    return await this.sessionModel.create({
      userId: userId,
      accessToken: generateToken(256),
      refreshToken: generateToken(256),
    })
  }

  async createAccount(userData: CreateUserDTO): Promise<SessionType> {
    if (await this.checkExistEmail(userData.email)) {
      createException('email_exist')
    }
    if (await this.checkExistUsername(userData.username)) {
      createException('username_exist')
    }
    if (userData.password != userData.confirm_password) {
      createException('password_not_equal')
    }

    const user = await this.userModel.create({
      username: userData.username,
      email: userData.email,
      password: await this.hashingPassword(userData.password),
    })
    const session = await this.createSession(user.id)

    return {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      access_token_expire: session.expireAccessToken,
      refresh_token_expire: session.expireRefreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: await this.getAvatarById(user.id),
        roles: user.roles
      }
    }
  }

  async getSessionByAccessToken(accessToken: string) {
    return this.sessionModel.findOne({
      where: { accessToken: accessToken },
      include: [
        { model: this.userModel, include: [{ model: this.avatarModel }] },
      ],
    })
  }

  async authAccount(userData: AuthUserDTO): Promise<SessionType> {
    if (!(await this.checkExistEmail(userData.email))) {
      createException('email_not_exist')
    }
    const user = await this.getUserByEmail(userData.email)
    if (!(await this.verifyPassword(userData.password, user.password))) {
      createException('invalid_password')
    }
    const session = await this.createSession(user.id)

    return {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      access_token_expire: session.expireAccessToken,
      refresh_token_expire: session.expireRefreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: await this.getAvatarById(user.id),
        roles: user.roles
      }
    }
  }

  async removeAccessToken(accessToken: string): Promise<StatusType> {
    await this.sessionModel.destroy({ where: { accessToken: accessToken } })
    return { status: 'ok' }
  }

  async removeSessions(accessToken: string): Promise<StatusType> {
    const session = await this.getSessionByAccessToken(accessToken)
    await this.sessionModel.destroy({
      where: {
        userId: session.userId,
        accessToken: {
          [Op.notIn]: [session.accessToken],
        },
      },
    })
    return { status: 'ok' }
  }

  async updatePasswordAccount(
    accessToken: string,
    password: string,
    new_password: string,
    confirm_password: string
  ): Promise<StatusType> {
    const session = await this.getSessionByAccessToken(accessToken)
    if (
      !(await this.verifyPassword(password, session.user.password))
    ) {
      createException('invalid_password')
    }
    if (new_password != confirm_password) {
      createException('password_not_equal')
    }
    await this.removeSessions(accessToken)
    session.user.password = await this.hashingPassword(new_password)
    await session.user.save()

    return { status: 'ok' }
  }

  async updateUsernameAccount(
    accessToken: string,
    username: string,
  ): Promise<StatusType> {
    const session = await this.getSessionByAccessToken(accessToken)
    if (await this.checkExistUsername(username)) {
      createException('username_exist')
    }
    session.user.username = username
    session.user.save()

    return { status: 'ok' }
  }

  async updateEmailAccount(
    accessToken: string,
    email: string,
  ): Promise<StatusType> {
    const session = await this.getSessionByAccessToken(accessToken)
    if (await this.checkExistEmail(email)) {
      createException('email_exist')
    }
    session.user.email = email
    session.user.save()

    return { status: 'ok' }
  }

  async getSessions(accessToken: string): Promise<SessionDescType[]> {
    const session = await this.getSessionByAccessToken(accessToken)
    const sessions = await this.sessionModel.findAll({
      where: {
        userId: session.userId,
        [Op.or]: {
          expireRefreshToken: {
            [Op.gte]: new Date(),
          },
          expireAccessToken: {
            [Op.gte]: new Date(),
          },
        },
        lastUsage: {
          [Op.not]: null,
        },
      },
      include: [{ model: this.userModel }],
    })
    return sessions.map((value) => {
      return {
        lastUsage: value.lastUsage,
        ipAddress: value.ipAddress,
        device: Object(value.device),
        expired: value.expireAccessToken < new Date(),
        renewable: value.expireRefreshToken > new Date(),
        currentSession: session.id === value.id,
      }
    })
  }

  async removeAvatar(access_token: string): Promise<StatusType> {
    const session = await this.getSessionByAccessToken(access_token)
    if (session.user.avatar) {
      await this.fileService.removeAvatar(session.user.avatar.name)
      await session.user.avatar.destroy()
      return { status: 'ok' }
    }
    createException('avatar_not_exist')
  }

  async uploadAvatar(
    access_token: string,
    originalName: string,
    buffer: Buffer,
    metadate: object,
  ): Promise<FileURLType> {
    const session = await this.getSessionByAccessToken(access_token)
    const file = await this.fileService.uploadAvatar(
      originalName,
      buffer,
      metadate,
    )
    if (session.user.avatar) {
      await this.fileService.removeAvatar(session.user.avatar.name)
      session.user.avatar.name = file.name
      session.user.avatar.url = file.url
      await session.user.avatar.save()
    } else {
      await this.avatarModel.create({
        userId: session.user.id,
        name: file.name,
        url: file.url,
      })
    }

    return { avatar: [process.env.MINIO_PUBLIC_URL, file.url].join('') }
  }
}
