<template>
  <el-card>
    <Category :scene="scene" />
  </el-card>
  <el-card v-show="scene === 0" style="margin-top: 10px;">
    <el-button type="primary" icon="Plus" :disabled="!categoryStore.category3Id" @click="addSpu">添加SPU</el-button>
    <el-table :data="spuData" border style="margin: 10px 0;">
      <el-table-column type="index" label="序号" width="88" align="center"></el-table-column>
      <el-table-column prop="spuName" label="SPU名称"></el-table-column>
      <el-table-column prop="description" label="SPU描述" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="Plus" @click="addSku(row)">添加SKU</el-button>
          <el-button type="warning" size="small" icon="Edit" @click="editSpu(row)">编辑</el-button>
          <el-button type="info" size="small" icon="View" @click="viewSpu(row)">查看</el-button>
          <el-popconfirm :title="`你确定要删除[${row.spuName}]吗？`" @confirm="deleteSpu(row)" width="260px">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasSpu"
      @size-change="sizeChange" />
  </el-card>
  <el-card v-show="scene === 1" style="margin-top: 10px;">
    <SpuForm ref="spu" @change-scene="changeScene" />
  </el-card>
  <el-card v-show="scene === 2" style="margin-top: 10px;">
    <SkuForm ref="sku" @change-scene="changeScene" />
  </el-card>
  <el-dialog v-model="dialogVisible" title="SKU列表" width="500" align-center>
    <el-table :data="spuDetailData" border>
      <el-table-column prop="skuName" label="SKU名称"></el-table-column>
      <el-table-column prop="price" label="SKU价格"></el-table-column>
      <el-table-column prop="weight" label="SKU重量"></el-table-column>
      <el-table-column label="SKU图片">
        <template #default="{ row }">
          <img :src="row.skuDefaultImg" alt="默认图片" width="100px" height="auto" />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useCategoryStore } from '@/store/modules/category'
import { reqSpuList, reqDeleteSpu, reqViewSpuDetail } from '@/api/product/spu'
import type { Spu, SpuResponseData, SpuDetailResponseData, SpuDetail } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

const categoryStore = useCategoryStore()
const scene = ref<number>(0)
const pageNo = ref<number>(1)
const pageSize = ref<number>(3)
const total = ref<number>(0)
const spuData = ref<Spu[]>([])
const spuDetailData = ref<SpuDetail[]>([])
const dialogVisible = ref<boolean>(false)
const spu = ref<any>()
const sku = ref<any>()

const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params === 'add') {
    getHasSpu()
  } else {
    getHasSpu(pageNo.value)
  }
}

watch(() => categoryStore.category3Id, () => {
  getHasSpu()
})

const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  const result: SpuResponseData = await reqSpuList(pageNo.value, pageSize.value, categoryStore.category3Id as number)
  if (result.code === 200) {
    spuData.value = result.data.records
    total.value = result.data.total
  }
}

const sizeChange = (size: number) => {
  pageSize.value = size
  getHasSpu()
}

const addSpu = () => {
  spu.value.initAddSpuParams()
  scene.value = 1
}

const addSku = (row: any) => {
  sku.value.initAddSkuParams(row)
  scene.value = 2
}

const editSpu = (row: any) => {
  spu.value.initUpdatSpuParams(row)
  scene.value = 1
}

const viewSpu = async (row: any) => {
  const result: SpuDetailResponseData = await reqViewSpuDetail(row.id)
  spuDetailData.value = result.data
  dialogVisible.value = true
}

const deleteSpu = async (row: any) => {
  console.log(row)
  const result: any = await reqDeleteSpu(row.id)
  console.log(result)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasSpu(spuData.value.length === 1 ? pageNo.value - 1 : pageNo.value)
  }
}

// 重点：路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset();
})
</script>

<style scoped lang="scss"></style>
