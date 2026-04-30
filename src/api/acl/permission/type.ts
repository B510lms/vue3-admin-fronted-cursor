export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface Permission {
  id?: number
  name: string
  pid: number
  code: string
  toCode: string
  type: number
  status: string
  level: number
  createTime: string
  updateTime: string
  children?: Permission[]
  select: boolean
}

export interface PermissionResponseData extends ResponseData {
  data: Permission[]
}

export interface PermissionParams {
  id?: number
  code: string
  name: string
  pid?: number
  level: number
  type?: number
}