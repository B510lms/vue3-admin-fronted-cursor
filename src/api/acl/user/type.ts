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

// 分配角色
export interface Role {
  id?: number
  roleName: string
  remark?: string
  crateTime?: string
  updateTime?: string
}

export interface GetRoleResopnse extends ResponseData {
  data: {
    assignRoles: Role[]
    allRolesList: Role[]
  }
}

export interface AssignRoleParams {
  roleIdList: number[]
  userId: number
}