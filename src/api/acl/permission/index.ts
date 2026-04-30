import request from "@/utils/request";
import type { PermissionResponseData, PermissionParams } from './type'

enum API {
  Permission_URL = '/admin/acl/permission',
  AddPermission_URL = '/admin/acl/permission/save',
  UpdatePermission_URL = '/admin/acl/permission/update',
  RemovePermission_URL = '/admin/acl/permission/remove/',
}

export const reqGetPermissionList = () => request.get<any, PermissionResponseData>(API.Permission_URL)
export const reqAddOrUpdatePermission = (data: PermissionParams) => {
  if (data.id) {
    return request.put<any, any>(API.UpdatePermission_URL, data)
  } else {
    return request.post<any, any>(API.AddPermission_URL, data)
  }
}
export const reqRemovePermission = (id: number) => request.delete<any, any>(API.RemovePermission_URL + id)
