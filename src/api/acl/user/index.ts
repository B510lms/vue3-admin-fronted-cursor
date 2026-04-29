import request from '@/utils/request'
import type { UserResponseData, UserParams, GetRoleResopnse, AssignRoleParams } from './type'

enum API {
  USER_URL = '/admin/acl/user/',
  AddUser_URL = '/admin/acl/user/save',
  UpdateUser_URL = '/admin/acl/user/update',
  DELETE_URL = '/admin/acl/user/remove/',
  BatchRemove_URL = '/admin/acl/user/batchRemove',
  GET_ROLE_LIST_URL = '/admin/acl/user/toAssign/',
  ASSIGN_URL = '/admin/acl/user/doAssignRole',
}

export const reqUser = (page: number, limit: number, username: string) => request.get<any, UserResponseData>(API.USER_URL + `${page}/${limit}?username=${username}`)

export const reqAddOrUpdateUser = (data: UserParams) => {
  if (data.id) {
    return request.put<any, any>(API.UpdateUser_URL, data)
  } else {
    return request.post<any, any>(API.AddUser_URL, data)
  }
}

export const reqDeleteUser = (id: number) => request.delete<any, any>(API.DELETE_URL + id)
export const reqBatchRemoveUser = (idList: number[]) => request.delete<any, any>(API.BatchRemove_URL, { data: idList })

export const reqGetRoleList = (userId: number) => request.get<any, GetRoleResopnse>(API.GET_ROLE_LIST_URL + userId)
export const reqAssignRole = (data: AssignRoleParams) => request.post<any, any>(API.ASSIGN_URL, data)
