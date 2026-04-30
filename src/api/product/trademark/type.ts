export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface Trade {
  id?: number
  tmName: string
  logoUrl: string
  createTime?: string
  updateTime?: string
}

export interface TradeResponseData extends ResponseData {
  data: {
    records: Trade[],
    total: number,
    size: number,
    current: number,
    pages: number,
    searchCount: boolean
  }
}

export interface TradeParams {
  id?: number
  tmName: string
  logoUrl: string
}