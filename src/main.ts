import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './module'
import { ValidationPipe } from './pipe'


(async function () {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.MICROSERVICE_HOST,
        port: Number(process.env.MICROSERVICE_PORT)
      }
    }
  )
  app.useGlobalPipes(new ValidationPipe())
  app.listen()
})()
