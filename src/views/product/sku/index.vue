<template>
  <el-card>
    <el-table :data="skuData" border style="margin: 10px 0;">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="名称" prop="skuName" show-overflow-tooltip></el-table-column>
      <el-table-column label="描述" prop="skuDesc" show-overflow-tooltip></el-table-column>
      <el-table-column label="图片">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="操作" width="340">
        <template #default="{ row }">
          <el-button :type="row.isSale === 1 ? 'info' : 'success'" size="small" @click="changeSale(row)"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'"></el-button>
          <el-button type="primary" size="small" @click="editSku(row)" icon="Edit"></el-button>
          <el-button type="warning" size="small" @click="viewSku(row)" icon="InfoFilled"></el-button>
          <el-popconfirm :title="`你确定要删除[${row.skuName}]吗?`" @confirm="deleteSku(row)" width="260px">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasSku"
      @size-change="sizeChange" />
  </el-card>
  <el-drawer v-model="drawerVisible" title="查看商品详情">
    <el-row style="margin: 10px 0;">
      <el-col :span="6">名称</el-col>
      <el-col :span="18">{{ skuDetail.skuName }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0;">
      <el-col :span="6">描述</el-col>
      <el-col :span="18" class="desc">{{ skuDetail.skuDesc }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0;">
      <el-col :span="6">价格</el-col>
      <el-col :span="18">{{ skuDetail.price }}</el-col>
    </el-row>
    <el-row style="margin: 10px 0;">
      <el-col :span="6">平台属性</el-col>
      <el-col :span="18">
        <el-tag v-for="item in skuDetail.skuAttrValueList" :key="item.id" style="margin: 5px;">{{
          item.valueName }}</el-tag>
      </el-col>
    </el-row>
    <el-row style="margin: 10px 0;">
      <el-col :span="6">销售属性</el-col>
      <el-col :span="18">
        <el-tag v-for="item in skuDetail.skuSaleAttrValueList" :key="item.id" style="margin: 5px;">
          {{ item.saleAttrValueName }}</el-tag>
      </el-col>
    </el-row>
    <el-row style="margin: 10px 0;">
      <el-col :span="6">商品图片</el-col>
      <el-col :span="18">
        <el-carousel indicator-position="outside" height="200px">
          <el-carousel-item v-for="item in skuDetail.skuImageList" :key="item.id">
            <div class="sku-carousel-item">
              <img :src="item.imgUrl" class="sku-carousel-img" alt="" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqOnSaleSku, reqCancelSaleSku, reqDeleteSku, reqDetailSku } from '@/api/product/sku/index'
import type { SkuData, SkuResponseData, SkuDetailData, SkuDetailResponseData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

const pageNo = ref<number>(1)
const pageSize = ref<number>(3)
const total = ref<number>(0)
const skuData = ref<SkuData[]>([])
const drawerVisible = ref<boolean>(false)
const skuDetail = ref<SkuDetailData>({
  spuId: 0,
  category3Id: 0,
  tmId: 0,
  skuName: '',
  weight: 0,
  price: 0,
  skuDesc: '',
  skuDefaultImg: '',
  isSale: 0,
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuImageList: []
})

onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  const result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    skuData.value = result.data.records
    total.value = result.data.total
  }
}

const sizeChange = (val: number) => {
  pageSize.value = val
  getHasSku()
}

const changeSale = async (row: SkuData) => {
  if (row.isSale === 1) {
    const result: any = await reqCancelSaleSku(row.id as number)
    if (result.code === 200) {
      ElMessage({ type: 'success', message: '下架成功' })
    }
  } else {
    const result: any = await reqOnSaleSku(row.id as number)
    if (result.code === 200) {
      ElMessage({ type: 'success', message: '上架成功' })
    }
  }
  getHasSku(pageNo.value)
}

const editSku = (row: SkuData) => {
  console.log(row)
  ElMessage({ type: 'warning', message: '程序员在努力开发中' })
}

const viewSku = async (row: SkuData) => {
  const result: SkuDetailResponseData = await reqDetailSku(row.id as number)
  skuDetail.value = result.data
  drawerVisible.value = true
}

const deleteSku = async (row: SkuData) => {
  const result: any = await reqDeleteSku(row.id as number)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
  }
  getHasSku(skuData.value.length === 1 ? pageNo.value - 1 : pageNo.value)
}
</script>

<style scoped lang="scss">
.sku-carousel-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sku-carousel-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.desc {
  line-height: 140%;
  overflow: hidden; // 防止过长文字撑开卡片
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; // 显示两行
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
