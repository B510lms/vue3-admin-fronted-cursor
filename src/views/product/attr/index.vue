<template>
  <el-card>
    <Category :scene="scene" />
  </el-card>
  <el-card v-show="scene === 0" style="margin-top: 10px;">
    <el-button type="primary" icon="Plus" :disabled="!categoryStore.category3Id" @click="AddAttr">添加属性</el-button>
    <el-table :data="attrData" border style="margin: 10px 0;">
      <el-table-column type="index" label="序号" width="88" align="center"></el-table-column>
      <el-table-column prop="attrName" label="属性名称" width="180"></el-table-column>
      <el-table-column label="属性值名称">
        <template #="{ row }">
          <el-tag v-for="tag in row.attrValueList" :key="tag.id" style="margin: 5px;">{{ tag.valueName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #="{ row }">
          <el-button type="warning" size="small" icon="Edit" @click="EditAttr(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除[${row.attrName}]吗？`" @confirm="DeleteAttr(row)" width="260px">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-card v-show="scene === 1" style="margin-top: 10px;">
    <el-form :inline="true">
      <el-form-item label="属性名称">
        <el-input v-model="attrParams.attrName" width="200px;"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="AddAttrValue" icon="Plus" :disabled="!attrParams.attrName">添加属性值</el-button>
    <el-table :data="attrParams.attrValueList" border style="margin: 10px 0;">
      <el-table-column type="index" label="序号" width="88" align="center"></el-table-column>
      <el-table-column label="属性值名称">
        <template #="{ row, $index }">
          <el-input :ref="(vc: any) => inputArr[$index] = vc" v-model="row.valueName" size="small"
            placeholder="请输入属性值名称" v-if="row.flag" @blur="toLook(row, $index)"></el-input>
          <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #="{ $index }">
          <el-button type="danger" size="small" icon="Delete" @click="DeleteAttrValue($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="save" style="margin-right: 10px;"
      :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
    <el-button @click="scene = 0">取消</el-button>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import useCategoryStore from '@/store/modules/category';
import { reqAttrList, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr'
import type { Attr, AttrResponseData, AttrValue } from '@/api/product/attr/type'

const categoryStore = useCategoryStore()
const attrData = ref<Attr[]>([])
const scene = ref<number>(0)
const attrParams = reactive<Attr>({
  attrName: '',
  categoryId: '',
  categoryLevel: 3,
  attrValueList: []
})
const inputArr = ref<any>([])

watch(() => categoryStore.category3Id, () => {
  getAttrList()
})

const getAttrList = async () => {
  const result: AttrResponseData = await reqAttrList(categoryStore.category1Id as number, categoryStore.category2Id as number, categoryStore.category3Id as number)
  if (result.code === 200) {
    attrData.value = result.data
  }
}

const AddAttr = () => {
  scene.value = 1
  Object.assign(attrParams, {
    id: 0,
    attrName: '',
    categoryId: categoryStore.category3Id,
    categoryLevel: 3,
    attrValueList: []
  })
}

const EditAttr = (row: Attr) => {
  scene.value = 1
  // ES6->Object.assign进行对象的合并 一定要是JSON.parse(JSON.stringify(row))深拷贝 不然编辑完再取消回到列表页发现已经改变了但是实际数据库的内容没变
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

const DeleteAttr = async (row: Attr) => {
  const result: any = await reqDeleteAttr(row.id as number)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  } else {
    ElMessage({
      type: 'error',
      message: result.message
    })
  }
  await getAttrList()
}

const AddAttrValue = () => {
  attrParams.attrValueList.push({
    id: 0,
    valueName: '',
    attrId: attrParams.id as number,
    flag: true
  })
  // 新增之后自动获取焦点,nextTick也必须加上，否则无法获取焦点
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

const DeleteAttrValue = ($index: number) => {
  attrParams.attrValueList.splice($index, 1)
}

const save = async () => {
  const result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '保存成功'
    })
  } else {
    ElMessage({
      type: 'error',
      message: result.message
    })
  }
  scene.value = 0
  await getAttrList()
}

// 重点：路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  //清空仓库的数据
  categoryStore.$reset();
})

// 重点：监听输入框blur事件变为div
const toLook = (row: AttrValue, $index: number) => {
  row.flag = false
  if (row.valueName.trim() === '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值名称不能为空'
    })
  }
  //非法情况2 切记把当前失却焦点属性值对象从当前数组扣除判断
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {
    attrParams.attrValueList.splice($index, 1);
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
  }
}

// 重点：监听div点击变为input
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    // 获取焦点
    inputArr.value[$index].focus()
  })
}
</script>

<style scoped lang="scss"></style>