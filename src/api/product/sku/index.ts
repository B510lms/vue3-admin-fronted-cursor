import request from "@/utils/request";
import type { SkuResponseData } from '@/api/product/sku/type'

enum API {
  SKU_URL = '/admin/product/list/',
  OnSaleSku_URL = '/admin/product/onSale/',
  CancelSaleSku_URL = '/admin/product/cancelSale/',
  DeleteSku_URL = '/admin/product/deleteSku/',
  DetailSku_URL = '/admin/product/getSkuInfo/',
}

export const reqSkuList = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
export const reqOnSaleSku = (skuId: number) => request.get<any, any>(API.OnSaleSku_URL + skuId)
export const reqCancelSaleSku = (skuId: number) => request.get<any, any>(API.CancelSaleSku_URL + skuId)
export const reqDeleteSku = (skuId: number) => request.delete<any, any>(API.DeleteSku_URL + skuId)
export const reqDetailSku = (skuId: number) => request.get<any, any>(API.DetailSku_URL + skuId)