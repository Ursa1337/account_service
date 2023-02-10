import { Injectable } from '@nestjs/common'
import { generateToken } from 'utils'
import { FileURLType } from './type'
import * as Minio from 'minio'
import * as path from 'path'


@Injectable()
export class FileService {
  constructor() {}

  async uploadAvatar(
    name: string,
    buffer: Buffer,
    metadate: object,
  ): Promise<FileURLType> {
    const client = await this.getClient()
    const extension = path.extname(name)
    while (1) {
      const uniqueName = [generateToken(32), extension].join('')

      const object = await client
        .getObject('avatars', uniqueName)
        .then((response) => {
          return response
        })
        .catch(() => {
          return null
        })

      if (object === null) {
        await client.putObject('avatars', uniqueName, buffer, metadate)
        return {
          name: uniqueName,
          url: '/avatars/' + uniqueName,
        }
      }
    }
  }

  async removeAvatar(name: string): Promise<void> {
    const client = await this.getClient()
    client.removeObject('avatars', name)
  }

  async getClient() {
    return new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USESSL === 'true',
      accessKey: process.env.MINIO_ACCESSKEY,
      secretKey: process.env.MINIO_SECRETKEY,
    })
  }
}
