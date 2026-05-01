import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'

enum API {
  GetCategory1_URL = '/admin/product/getCategory1',
  GetCategory2_URL = '/admin/product/getCategory2/',
  GetCategory3_URL = '/admin/product/getCategory3/',
  AttrList_URL = '/admin/product/attrInfoList/',
  AddOrUpdateAttr_URL = '/admin/product/saveAttrInfo',
  DeleteAttr_URL = '/admin/product/deleteAttr/'
}

export const reqCategory1List = () => request.get<any, CategoryResponseData>(API.GetCategory1_URL)
export const reqCategory2List = (category1Id: number) => request.get<any, CategoryResponseData>(API.GetCategory2_URL + category1Id)
export const reqCategory3List = (category2Id: number) => request.get<any, CategoryResponseData>(API.GetCategory3_URL + category2Id)

export const reqAttrList = (category1Id: number, category2Id: number, category3Id: number) => request.get<any, AttrResponseData>(API.AttrList_URL + `${category1Id}/${category2Id}/${category3Id}`)
export const reqAddOrUpdateAttr = (data: Attr) => request.post<any, any>(API.AddOrUpdateAttr_URL, data)
export const reqDeleteAttr = (attrId: number) => request.delete<any, any>(API.DeleteAttr_URL + attrId)