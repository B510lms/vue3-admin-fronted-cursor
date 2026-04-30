import request from "@/utils/request";
import type { TradeResponseData, TradeParams } from './type'

enum API {
  TRADE_URL = '/admin/product/baseTrademark/',
  AddTrade_URL = '/admin/product/baseTrademark/save',
  UpdateTrade_URL = '/admin/product/baseTrademark/update',
  DELETE_URL = '/admin/product/baseTrademark/remove/'
}

export const reqTradeList = (page: number, limit: number) => request.get<any, TradeResponseData>(API.TRADE_URL + `${page}/${limit}`)
export const reqAddOrUpdateTrade = (data: TradeParams) => {
  if (data.id) {
    return request.put<any, any>(API.UpdateTrade_URL, data)
  } else {
    return request.post<any, any>(API.AddTrade_URL, data)
  }
}
export const reqDeleteTrade = (id: number) => request.delete<any, any>(API.DELETE_URL + id)