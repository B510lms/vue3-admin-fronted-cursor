<template>
  <el-form :model="SpuParams" ref="formRef" :rules="rules" label-width="110px">
    <el-form-item prop="spuName" label="SPU名称">
      <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item prop="tmId" label="SPU品牌">
      <el-select v-model="SpuParams.tmId" placeholder="请选择SPU品牌">
        <el-option v-for="item in allTradeMark" :key="item.id" :label="item.tmName" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item prop="description" label="SPU描述">
      <el-input placeholder="请输入SPU描述" type="textarea" v-model="SpuParams.description"></el-input>
    </el-form-item>
    <el-form-item prop="spuImageList" label="SPU图片">
      <el-upload v-model:file-list="imageList" :headers="{ Token: userStore.token }"
        action="/api/admin/product/fileUpload" list-type="picture-card" :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload" :on-preview="handlePictureCardPreview"
        @change="formRef?.validateField('spuImageList')">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible" style="text-align: center;">
        <img :src="dialogImageUrl" alt="预览图片" />
      </el-dialog>
    </el-form-item>
    <el-form-item prop="spuSaleAttrList" label="SPU销售属性">
      <el-select v-model="saleAttrIdAndValue"
        :placeholder="unSelectedSaleAttr.length > 0 ? `还未选择${unSelectedSaleAttr.length}个` : '无'"
        style="width: 180px; margin-right: 10px;">
        <el-option v-for="item in unSelectedSaleAttr" :key="item.id" :label="item.name"
          :value="`${item.id}:${item.name}`" />
      </el-select>
      <el-button :disabled="saleAttrIdAndValue ? false : true" type="primary" icon="Plus"
        @click="addSpuAttr">添加属性</el-button>
      <el-table :data="SpuParams.spuSaleAttrList" border style="margin: 10px 0;">
        <el-table-column type="index" label="序号" align="center" width="88"></el-table-column>
        <el-table-column prop="saleAttrName" label="销售属性名字" align="center" width="140"></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row }">
            <el-tag v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" closable
              @close="row.spuSaleAttrValueList.splice(index, 1)" style="margin: 5px;">
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input v-if="row.inputVisible" ref="inputRef" v-model="row.inputValue" size="small" style="width: 80px;"
              placeholder="请输入" @keyup.enter="toLook(row)" @blur="toLook(row)" />
            <el-button v-else size="small" type="primary" icon="Plus" @click="toEdit(row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #="{ row }">
            <el-button type="danger" size="small" icon="Delete" @click="deleteSpuAttr(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveSpu">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useCategoryStore } from '@/store/modules/category'
import { reqAllSaleAttrList, reqAllTradeMarkList, reqSpuImageList, reqSpuSaleAttrList, reqAddOrUpdateSpu } from '@/api/product/spu/index'
import type { Spu, SaleAttrResponseData, SaleAttr, TrademarkResponseData, Trademark, SpuImageResponseData, SpuImage, SpuSaleAttrResponseData, SpuSaleAttr } from '@/api/product/spu/type'

const userStore = useUserStore()
const categoryStore = useCategoryStore()
const SpuParams = reactive<Spu>({
  spuName: '',
  description: '',
  category3Id: categoryStore.category3Id as number,
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: []
})
const allSaleAttr = ref<SaleAttr[]>([])
const unSelectedSaleAttr = computed(() => {
  return allSaleAttr.value.filter(item => {
    return SpuParams.spuSaleAttrList.every(item2 => {
      return item2.saleAttrName !== item.name
    })
  })
})
const saleAttrIdAndValue = ref<string>('')
const allTradeMark = ref<Trademark[]>([])
const imageList = ref<SpuImage[]>([])
const inputRef = ref<any>()
const formRef = ref<any>()

const rules = {
  spuName: [
    { required: true, message: '请输入SPU名称', trigger: 'blur' }
  ],
  tmId: [
    { required: true, message: '请选择SPU品牌', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入SPU描述', trigger: 'blur' }
  ],
  spuImageList: [
    {
      required: true,
      validator: (_rule: any, _value: SpuImage[], callback: any) => {
        if (imageList.value.length === 0) {
          callback(new Error('请上传图片'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  spuSaleAttrList: [
    {
      required: true,
      validator: (_rule: any, value: SpuSaleAttr[], callback: any) => {
        if (!value?.length) {
          callback(new Error('请添加属性'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const initUpdatSpuParams = async (row: Spu) => {
  Object.assign(SpuParams, row)
  // 获取所有销售属性
  const result1: SaleAttrResponseData = await reqAllSaleAttrList()
  allSaleAttr.value = result1.data
  // 获取所有品牌
  const result2: TrademarkResponseData = await reqAllTradeMarkList()
  allTradeMark.value = result2.data
  // 获取SPU的图片列表
  const result3: SpuImageResponseData = await reqSpuImageList(SpuParams.id as number)
  imageList.value = result3.data.map(item => {
    return {
      url: item.imgUrl,
      name: item.imgName
    }
  })
  // 获取SPU的属性列表
  const result4: SpuSaleAttrResponseData = await reqSpuSaleAttrList(SpuParams.id as number)
  SpuParams.spuSaleAttrList = result4.data
  nextTick(() => {
    formRef.value.clearValidate("spuName")
    formRef.value.clearValidate("tmId")
    formRef.value.clearValidate("description")
    formRef.value.clearValidate("spuImageList")
    formRef.value.clearValidate("spuSaleAttrList")
  })
}

const initAddSpuParams = async () => {
  Object.assign(SpuParams, {
    id: 0,
    spuName: '',
    description: '',
    category3Id: categoryStore.category3Id,
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
  })
  // 获取所有销售属性
  const result1: SaleAttrResponseData = await reqAllSaleAttrList()
  allSaleAttr.value = result1.data
  // 获取所有品牌
  const result2: TrademarkResponseData = await reqAllTradeMarkList()
  allTradeMark.value = result2.data
  // 获取SPU的图片列表
  imageList.value = []
  nextTick(() => {
    formRef.value.clearValidate("spuName")
    formRef.value.clearValidate("tmId")
    formRef.value.clearValidate("description")
    formRef.value.clearValidate("spuImageList")
    formRef.value.clearValidate("spuSaleAttrList")
  })
}

// 上传图片
import type { UploadProps } from 'element-plus'
const handleAvatarSuccess = () => {
  console.log("图片上传成功")
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('上传文件必须为jpg格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片的文件大小不能大于2MB!')
    return false
  }
  return true
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview = (imgae: SpuImage) => {
  dialogImageUrl.value = imgae.url!
  dialogVisible.value = true
}

const addSpuAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValue.value.split(':')
  SpuParams.spuSaleAttrList.push({
    saleAttrName,
    baseSaleAttrId: Number(baseSaleAttrId),
    spuId: SpuParams.id as number,
    spuSaleAttrValueList: []
  })
  // 清空
  saleAttrIdAndValue.value = ''
  nextTick(() => formRef.value?.validateField('spuSaleAttrList'))
}

const saveSpu = async () => {
  await formRef.value.validate()
  SpuParams.spuImageList = imageList.value.map(item => {
    return {
      imgName: item.name,
      imgUrl: item.response ? item.response.data : item.url
    }
  })
  const result: any = await reqAddOrUpdateSpu(SpuParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.id ? '修改成功' : '添加成功'
    })
    emits('changeScene', { flag: 0, params: SpuParams.id ? 'update' : 'add' })
  }
}

const cancel = () => {
  emits('changeScene', { flag: 0 })
}

const toEdit = (row: SpuSaleAttr) => {
  row.inputVisible = true
  row.inputValue = ''
  nextTick(() => {
    inputRef.value.focus()
  })
}

const toLook = (row: SpuSaleAttr) => {
  if (row.inputValue === '') {
    ElMessage({
      type: 'warning',
      message: '属性值不能为空'
    })
  }
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName === row.inputValue
  })
  if (repeat) {
    ElMessage({
      type: 'warning',
      message: '属性值名称不能重复'
    })
  }

  if (row.inputValue && !repeat) {
    row.spuSaleAttrValueList.push({
      saleAttrValueName: row.inputValue,
      spuId: row.spuId,
      baseSaleAttrId: row.baseSaleAttrId
    })
  }
  row.inputVisible = false
  row.inputValue = ''
}

const deleteSpuAttr = (row: SpuSaleAttr) => {
  // 将该属性的属性值清空
  row.spuSaleAttrValueList = []
  // 删除该属性（过滤出和本行的属性名称不同的属性再赋值给属性列表）
  SpuParams.spuSaleAttrList = SpuParams.spuSaleAttrList.filter(item => {
    return item.saleAttrName !== row.saleAttrName
  })
  nextTick(() => formRef.value?.validateField('spuSaleAttrList'))
}

// 子传父 父组件写 changeScene 方法 子组件通过 defineEmits 和 emits 发请求
const emits = defineEmits(['changeScene'])

// 暴露给父组件方法 父组件通过 ref 获取
defineExpose({ initUpdatSpuParams, initAddSpuParams })
</script>