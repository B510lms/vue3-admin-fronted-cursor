import request from "@/utils/request";
import type { RoleResponseData, RoleParams, PermissionResponseData, AssignPermissionParams } from './type'

enum API {
  ROLE_URL = '/admin/acl/role/',
  AddRole_URL = '/admin/acl/role/save',
  UpdateRole_URL = '/admin/acl/role/update',
  DeleteRole_URL = '/admin/acl/role/remove/',
  GET_ROLE_LIST_URL = '/admin/acl/permission/toAssign/',
  ASSIGN_URL = '/admin/acl/permission/doAssign?'
}

export const reqRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(API.ROLE_URL + `${page}/${limit}?roleName=${roleName}`)

export const reqAddOrUpdateRole = (data: RoleParams) => {
  if (!data.id) {
    return request.post<any, any>(API.AddRole_URL, data)
  } else {
    return request.put<any, any>(API.UpdateRole_URL, data)
  }
}

export const reqDeleteRole = (id: number) => request.delete<any, any>(API.DeleteRole_URL + id)

export const reqGetPermissionList = (roleId: number) => request.get<any, PermissionResponseData>(API.GET_ROLE_LIST_URL + roleId)
export const reqAssignPermission = (data: AssignPermissionParams) => request.post<any, any>(API.ASSIGN_URL + `roleId=${data.roleId}&permissionId=${data.permissionId}`)