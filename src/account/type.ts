export interface AccountType extends FileURLType {
  username: string
  email: string
  roles: string[]
}

export interface SessionType {
  access_token: string
  refresh_token: string
  access_token_expire: Date
  refresh_token_expire: Date
  user: AccountType
}

export interface StatusType {
  status: 'ok'
}

export interface DeviceType {
  ua?: string
  browser?: {
    name?: string
    version?: string
    major?: string
  }
  engine?: {
    name?: string
    version?: string
  }
  os?: {
    name?: string
    version?: string
  }
  device?: {
    model?: string
    type?: string
    vendor?: string
  }
  cpu?: {
    architecture?: string
  }
}

export interface SessionDescType {
  lastUsage: Date | null
  ipAddress: string | null
  expired: boolean
  device: DeviceType | null
  renewable: boolean
  currentSession: boolean
}

export interface FileURLType {
  avatar: string
}