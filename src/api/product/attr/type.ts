export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface Category {
  id: number
  name: string
  category1Id?: number
  category2Id?: number
}

export interface CategoryResponseData extends ResponseData {
  data: Category[]
}

export interface AttrValue {
  id?: number
  valueName: string
  attrId: number
  flag?: boolean
}

export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValue[]
}

export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
