import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  HttpStatus
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'


@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value
    }

    const obj = plainToClass(metadata.metatype, value)
    if (typeof obj !== 'object') {
      throw new RpcException({
        error: 'validation_error',
        message: 'type must be object',
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }
    const errors = await validate(obj, { validationError: { target: false } })

    if (errors.length) {
      let err = errors.shift()
      if (err.children.length) {
        err = err.children.shift()
      }
      throw new RpcException({
        error: 'validation_error',
        property: err.property,
        message: Object.values(err.constraints)[0],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }
    return value
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
