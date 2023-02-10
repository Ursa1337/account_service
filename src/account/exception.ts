import { RpcException } from '@nestjs/microservices'


export function createException(exception: string): void {
  switch (exception) {
    case 'unauthorization':
      throw new RpcException (
        {
          error: 'unauthorization',
          message: 'Unauthorization',
          statusCode: 403
        }
      )
    case 'expire':
      throw new RpcException (
        {
          error: 'expire',
          message: 'Expire',
          statusCode: 403
        }
      )
    case 'forbidden':
      throw new RpcException (
        {
          error: 'forbidden',
          message: 'Forbidden',
          statusCode: 403
        }
      )
    case 'email_exist':
      throw new RpcException (
        {
          error: 'email_exist',
          property: 'email',
          message: 'Email address is exist',
          statusCode: 400
        }
      )
    case 'email_not_exist':
      throw new RpcException (
        {
          error: 'email_not_exist',
          property: 'email',
          message: 'Email address is not exist',
          statusCode: 400
        }
      )
    case 'username_exist':
      throw new RpcException (
        {
          error: 'username_exist',
          property: 'username',
          message: 'Username is exist',
          statusCode: 400
        }
      )
    case 'password_not_equal':
      throw new RpcException (
        {
          error: 'password_not_equal',
          property: 'confirm_password',
          message: 'Passwords are not equal',
          statusCode: 400
        }
      )
    case 'invalid_password':
      throw new RpcException (
        {
          error: 'invalid_password',
          property: 'password',
          message: 'Invalid password',
          statusCode: 400
        }
      )
    case 'avatar_not_exist':
      throw new RpcException (
        {
          error: 'avatar_not_exist',
          message: 'Avatar not exist',
          statusCode: 400
        }
      )
  }
}
