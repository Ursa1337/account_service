import { Module } from '@nestjs/common'
import { AccountController } from './controller'
import { User, Session, Avatar } from './entity'
import { AccountService } from './service'
import { FileModule } from 'file/module'
import { SequelizeModule } from '@nestjs/sequelize'


@Module({
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
  imports: [
    SequelizeModule.forFeature([User, Session, Avatar], 'account'),
    FileModule
  ],
})

export class AccountModule {}
