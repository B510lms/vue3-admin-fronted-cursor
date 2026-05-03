<template>
  <el-form :model="skuParams" label-width="100px">
    <el-form-item prop="skuName" label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="请输入SKU名称"></el-input>
    </el-form-item>
    <el-form-item prop="price" label="价格(元)">
      <el-input v-model="skuParams.price" placeholder="请输入价格(元)" type="number"></el-input>
    </el-form-item>
    <el-form-item prop="weight" label="重量(g)">
      <el-input v-model="skuParams.weight" placeholder="请输入重量(g)" type="number"></el-input>
    </el-form-item>
    <el-form-item prop="skuDesc" label="SKU描述">
      <el-input v-model="skuParams.skuDesc" placeholder="请输入SKU描述" type="textarea"></el-input>
    </el-form-item>
    <el-form-item prop="skuAttrValueList" label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="attr in allAttr" :key="attr.id" :label="attr.attrName" style="width: 180px">
          <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
            <el-option v-for="item in attr.attrValueList" :key="item.id" :label="item.valueName"
              :value="`${attr.id}:${item.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item prop="skuSaleAttrValueList" label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="attr in allSaleAttr" :key="attr.id" :label="attr.saleAttrName" style="width: 180px">
          <el-select v-model="attr.saleAttrIdAndValueId" placeholder="请选择">
            <el-option v-for="item in attr.spuSaleAttrValueList" :key="item.id" :label="item.saleAttrValueName"
              :value="`${attr.id}:${item.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item prop="skuName" label="图片名称">
      <el-table :data="allImage" border ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row }">
            <img :src="row.imgUrl" width="100px" height="auto" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="setDefault(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCategoryStore } from '@/store/modules/category'
import { reqAttrList } from '@/api/product/attr/index'
import type { Attr, AttrResponseData } from '@/api/product/attr/type'
import { reqSpuSaleAttrList, reqSpuImageList, reqAddSku } from '@/api/product/spu/index'
import type { SpuSaleAttr, SpuSaleAttrResponseData, SpuImage, SpuImageResponseData, SkuParams } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()
const skuParams = reactive<SkuParams>({
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
  skuImageList: [],
  category3Id: categoryStore.category3Id as number,
  spuId: "",
  tmId: "",
})
const allAttr = ref<Attr[]>([])
const allSaleAttr = ref<SpuSaleAttr[]>([])
const allImage = ref<SpuImage[]>([])
const table = ref<any>()

const initAddSkuParams = async (row: any) => {
  Object.assign(skuParams, {
    skuName: '',
    price: '',
    weight: '',
    skuDesc: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: '',
    skuImageList: [],
    category3Id: categoryStore.category3Id as number,
    spuId: row.id,
    tmId: row.tmId
  })
  // 所有平台属性
  const result1: AttrResponseData = await reqAttrList(categoryStore.category1Id as number, categoryStore.category2Id as number, categoryStore.category3Id as number)
  allAttr.value = result1.data
  // 所有销售属性
  const result2: SpuSaleAttrResponseData = await reqSpuSaleAttrList(row.id)
  allSaleAttr.value = result2.data
  // sku图片
  const result3: SpuImageResponseData = await reqSpuImageList(row.id)
  allImage.value = result3.data
}

const setDefault = (row: any) => {
  //勾选当前图片
  table.value.toggleRowSelection(row, true);
  //设置默认图片地址
  skuParams.skuDefaultImg = row.imgUrl;
}

const save = async () => {
  //平台属性
  skuParams.skuAttrValueList = allAttr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':');
      prev.push({
        attrId,
        valueId
      })
    }
    return prev;
  }, []);
  //销售属性
  skuParams.skuSaleAttrValueList = allSaleAttr.value.reduce((prev: any, next: any) => {
    if (next.saleAttrIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleAttrIdAndValueId.split(':');
      prev.push({
        saleAttrId, saleAttrValueId
      })
    }
    return prev;
  }, []);
  //收集选中的图片数据
  const selectedImage = table.value.getSelectionRows();
  skuParams.skuImageList = selectedImage.map((item: any) => {
    return {
      id: item.id,
      imgName: item.imgName,
      imgUrl: item.imgUrl,
      spuImgId: item.id,
      isDefault: item.imgUrl === skuParams.skuDefaultImg ? '1' : '0'
    }
  });
  const result = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '添加成功' })
  } else {
    ElMessage({ type: 'error', message: '添加失败' })
  }
  emit('changeScene', { flag: 0, params: 'add' })
}

const cancel = () => {
  emit('changeScene', { flag: 0, params: 'add' })
}

const emit = defineEmits(['changeScene'])
defineExpose({ initAddSkuParams })
</script>

<style scoped lang="scss"></style>