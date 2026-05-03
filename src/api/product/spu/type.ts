export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

// SPU图片列表
export interface SpuImage {
  id?: number;
  imgName?: string;
  imgUrl?: string;
  spuId?: number;
  name?: string
  url?: string
  response?: any
}

export interface SpuImageResponseData extends ResponseData {
  data: SpuImage[]
}

// SPU销售属性列表
export interface SpuSaleAttrValue {
  id?: number;
  saleAttrValueName: string;
  spuId: number;
  baseSaleAttrId: number;
}

export interface SpuSaleAttr {
  id?: number;
  saleAttrName: string;
  spuId: number;
  baseSaleAttrId: number;
  spuSaleAttrValueList: SpuSaleAttrValue[]
  inputVisible?: boolean
  inputValue?: string
  saleAttrIdAndValueId?: string
}

export interface SpuSaleAttrResponseData extends ResponseData {
  data: SpuSaleAttr[]
}

export interface Spu {
  id?: number;
  spuName: string;
  description: string;
  category3Id: number;
  tmId: number | string;
  spuImageList: SpuImage[];
  spuSaleAttrList: SpuSaleAttr[];
}

export interface SpuResponseData extends ResponseData {
  data: {
    records: Spu[]
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 所有销售属性
export interface SaleAttr {
  id: number
  name: string
}

export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 所有品牌
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

export interface TrademarkResponseData extends ResponseData {
  data: Trademark[]
}

// 查看
export interface SpuDetail {
  id?: number
  skuName: string
  price: number
  weight: number
  skuDefaultImg: string
}

export interface SpuDetailResponseData extends ResponseData {
  data: SpuDetail[]
}

// 添加SKU
export interface SkuParams {
  id?: number | string
  skuName: string
  price: number | string
  weight: number | string
  skuDesc: string
  skuAttrValueList: SkuAttrValue[]
  skuSaleAttrValueList: SkuSaleAttrValue[]
  skuDefaultImg: string
  skuImageList: SkuImage[]
  tmId: number | string
  category3Id: number
  spuId: number | string
}

export interface SkuImage {
  id?: number
  imgName: string
  imgUrl: string
  isDefault: string
  skuId: number
}

export interface SkuAttrValue {
  id?: number
  attrId: string
  valueId: string
}

export interface SkuSaleAttrValue {
  id?: number
  saleAttrId: string
  saleAttrValueId: string
}