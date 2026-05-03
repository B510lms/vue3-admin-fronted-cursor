export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface SkuAttrValue {
  id?: number
  attrId: number
  valueId: number
  attrName: string
  valueName: string
  skuId: number
}

export interface SkuSaleAttrValue {
  id?: number
  saleAttrId: number
  saleAttrName: string
  saleAttrValueId: number
  saleAttrValueName: string
  skuId: number
}

export interface SkuImage {
  id?: number
  imgName: string
  imgUrl: string
  isDefault: string
  skuId: number
}

export interface SkuData {
  id?: number
  spuId?: number
  category3Id?: number
  tmId?: number
  skuName: string
  price: number | string
  weight: number | string
  skuDefaultImg: string
  isSale: number
  skuAttrValueList: SkuAttrValue[]
  skuSaleAttrValueList: SkuSaleAttrValue[]
  skuImageList: SkuImage[]
}

export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// SKU详情
export interface SkuDetailData {
  id?: number
  spuId: number
  category3Id: number
  tmId: number
  skuName: string
  weight: number
  price: number
  skuDesc: string
  skuDefaultImg: string
  isSale: number
  skuAttrValueList: SkuAttrValue[]
  skuSaleAttrValueList: SkuSaleAttrValue[]
  skuImageList: SkuImage[]
}

export interface SkuDetailResponseData extends ResponseData {
  data: SkuDetailData
}