import {
  Table,
  Model,
  Column,
  DataType,
  Index,
  ForeignKey,
  HasMany,
  HasOne,
  Sequelize,
  Default,
  BelongsTo,
} from 'sequelize-typescript'


@Table
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Index
  @Column({ type: DataType.STRING(32), unique: true, allowNull: false })
  username: string

  @Index
  @Column({ type: DataType.STRING(64), unique: true, allowNull: false })
  email: string

  @Column({ type: DataType.STRING(72), allowNull: false })
  password: string

  @Column({ type: DataType.JSON, allowNull: true })
  roles: string[]

  @HasMany(() => Session)
  sessions: Session[]

  @HasOne(() => Avatar)
  avatar: Awaited<Avatar>
}

@Table
export class Session extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => User)
  userId: number

  @Index
  @Column({ type: DataType.STRING(256), unique: true, allowNull: false })
  accessToken: string

  @Index
  @Column({ type: DataType.STRING(256), unique: true, allowNull: false })
  refreshToken: string

  @Column({ type: DataType.INET })
  ipAddress: string

  @Column({ type: DataType.DATE })
  lastUsage: Date

  @Column({ type: DataType.JSON })
  device: JSON

  @Default(Sequelize.fn('now'))
  @Column({ type: DataType.DATE, allowNull: false })
  create: Date

  @Default(Sequelize.literal("NOW() + INTERVAL '1' DAY"))
  @Column({ type: DataType.DATE, allowNull: false })
  expireAccessToken: Date

  @Default(Sequelize.literal("NOW() + INTERVAL '30' DAY"))
  @Column({ type: DataType.DATE, allowNull: false })
  expireRefreshToken: Date

  @BelongsTo(() => User)
  user: User
}

@Table
export class Avatar extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number

  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  @ForeignKey(() => User)
  userId: number

  @Column({ type: DataType.STRING(128), unique: true, allowNull: false })
  name: string

  @Column({ type: DataType.STRING(128), unique: true, allowNull: false })
  url: string

  @BelongsTo(() => User)
  user: User
}
