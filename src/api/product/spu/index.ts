import request from "@/utils/request";
import type { SpuResponseData, Spu, SaleAttrResponseData, TrademarkResponseData, SpuImageResponseData, SpuSaleAttrResponseData, SpuDetailResponseData, SkuParams } from "./type";

enum API {
  SpuList_URL = "/admin/product/",
  AddSpu_URL = "/admin/product/saveSpuInfo",
  UpdateSpu_URL = "/admin/product/updateSpuInfo",
  AllSaleAttrList_URL = '/admin/product/baseSaleAttrList',
  AllTradeMarkList_URL = '/admin/product/baseTrademark/getTrademarkList',
  SpuImageList_URL = '/admin/product/spuImageList/',
  SpuSaleAttrList_URL = '/admin/product/spuSaleAttrList/',
  DeleteSpu_URL = '/admin/product/deleteSpu/',
  ViewSkuList_URL = '/admin/product/findBySpuId/',
  AddSku_URL = '/admin/product/saveSkuInfo'
}

export const reqSpuList = (page: number, limit: number, category3Id: number) =>
  request.get<any, SpuResponseData>(API.SpuList_URL + `${page}/${limit}?category3Id=${category3Id}`);

export const reqAddOrUpdateSpu = (data: Spu) => {
  if (data.id) {
    return request.post<any, any>(API.UpdateSpu_URL, data);
  } else {
    return request.post<any, any>(API.AddSpu_URL, data);
  }
};

export const reqAllSaleAttrList = () => request.get<any, SaleAttrResponseData>(API.AllSaleAttrList_URL);
export const reqAllTradeMarkList = () => request.get<any, TrademarkResponseData>(API.AllTradeMarkList_URL);
export const reqSpuImageList = (spuId: number) => request.get<any, SpuImageResponseData>(API.SpuImageList_URL + spuId);
export const reqSpuSaleAttrList = (spuId: number) => request.get<any, SpuSaleAttrResponseData>(API.SpuSaleAttrList_URL + spuId);
export const reqDeleteSpu = (spuId: number) => request.delete<any, any>(API.DeleteSpu_URL + spuId);
export const reqViewSpuDetail = (spuId: number) => request.get<any, SpuDetailResponseData>(API.ViewSkuList_URL + spuId);
export const reqAddSku = (data: SkuParams) => request.post<any, any>(API.AddSku_URL, data);