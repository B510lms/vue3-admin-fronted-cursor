export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface Role {
  id?: number
  roleName: string
  remark?: string
  crateTime?: string
  updateTime?: string
}

export interface RoleResponseData extends ResponseData {
  data: {
    records: Role[]
    total: number
    size: number
    current: number
    pages: number
    searchCount: boolean
  }
}

export interface RoleParams {
  id?: number
  roleName: string
  remark?: string
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

export interface AssignPermissionParams {
  roleId: number
  permissionId: number[]
}