import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config'
import { AccountModule } from './account/module'
import { FileModule } from 'file/module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      define: {
        timestamps: false,
      },
    }),
    AccountModule,
    FileModule,
  ],
})

export class AppModule {}
