<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择一级分类" style="width: 200px;" v-model="categoryStore.category1Id"
          :disabled="scene === 1">
          <el-option v-for="item in categoryStore.category1List" :key="item.id" :label="item.name" :value="item.id"
            @click="handler1" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择二级分类" style="width: 200px;" v-model="categoryStore.category2Id"
          :disabled="scene === 1">
          <el-option v-for="item in categoryStore.category2List" :key="item" :label="item.name" :value="item.id"
            @click="handler2" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择三级分类" style="width: 200px;" v-model="categoryStore.category3Id"
          :disabled="scene === 1">
          <el-option v-for="item in categoryStore.category3List" :key="item" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCategoryStore } from '@/store/modules/category'

const categoryStore = useCategoryStore()
defineProps<{
  scene: number
}>()

onMounted(() => {
  categoryStore.getCategory1List()
})

const handler1 = async () => {
  categoryStore.getCategory2List(categoryStore.category1Id as number)
  categoryStore.category3List = []
  categoryStore.category2Id = ""
  categoryStore.category3Id = ""
}

const handler2 = async () => {
  categoryStore.getCategory3List(categoryStore.category2Id as number)
  categoryStore.category3Id = ""
}
</script>

<style scoped lang="scss"></style>