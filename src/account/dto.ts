import { IsEmail, IsNotEmpty, Length, IsString } from 'class-validator'


export class CreateUserDTO {
  @Length(3, 64)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string

  @Length(3, 32)
  @IsString()
  @IsNotEmpty()
  readonly username: string

  @IsString()
  @IsNotEmpty()
  readonly password: string

  @IsString()
  @IsNotEmpty()
  readonly confirm_password: string
}

export class AuthUserDTO {
  @Length(3, 64)
  @IsString()
  @IsNotEmpty()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  readonly password: string
}

export class AccessTokenDTO {
  @Length(256, 256)
  @IsString()
  @IsNotEmpty()
  readonly access_token: string
}

export class RefreshTokenDTO {
  @Length(256, 256)
  @IsString()
  @IsNotEmpty()
  readonly refresh_token: string
}

export class PasswordUpdateDTO extends AccessTokenDTO {
  @IsString()
  @IsNotEmpty()
  readonly password: string

  @IsString()
  @IsNotEmpty()
  readonly new_password: string

  @IsString()
  @IsNotEmpty()
  readonly confirm_password: string
}

export class UsernameDTO {
  @Length(3, 32)
  @IsString()
  @IsNotEmpty()
  readonly username: string
}

export class UsernameUpdateDTO extends AccessTokenDTO {
  @Length(3, 32)
  @IsString()
  @IsNotEmpty()
  readonly username: string
}

export class EmailDTO {
  @Length(3, 64)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string
}

export class EmailUpdateDTO extends AccessTokenDTO {
  @Length(3, 64)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string
}

export class AvatarUpdate extends AccessTokenDTO {
  @IsString()
  @IsNotEmpty()
  originalname: string

  @IsString()
  @IsNotEmpty()
  mimetype: string

  @IsNotEmpty()
  file: Buffer
}