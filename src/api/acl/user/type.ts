export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface User {
  id?: number
  username: string
  password?: string
  roleName?: string
  createTime?: string
  updateTime?: string
}

export interface UserResponseData extends ResponseData {
  data: {
    records: User[]
    total: number
    size: number
    current: number
    pages: number
  }
}

export interface UserParams {
  id?: number
  name?: string
  username: string
  password?: string
}