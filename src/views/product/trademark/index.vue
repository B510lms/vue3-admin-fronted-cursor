<template>
  <el-card>
    <el-button type="primary" icon="Plus" @click="AddTrade">添加品牌</el-button>
    <el-table :data="tradeData" border style="margin: 10px 0;">
      <el-table-column type="index" label="序号" width="88px" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px"></img>
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row }">
          <el-button type="warning" size="small" icon="Edit" @click="Edit(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除[${row.tmName}]吗？`" width="260px" @confirm="Delete(row)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total" @size-change="sizeChange"
      @current-change="getHasTrade" />
  </el-card>
  <el-dialog v-model="dialogVisible" :title="TradeParams.id ? '修改品牌' : '添加品牌'">
    <el-form ref="formRef" :rules="rules" :model="TradeParams" label-width="100px">
      <el-form-item prop="tmName" label="品牌名称:">
        <el-input v-model="TradeParams.tmName" placeholder="请输入品牌名称"></el-input>
      </el-form-item>
      <el-form-item prop="logoUrl" label="品牌LOGO:">
        <el-upload class="avatar-uploader" :headers='{ Token: userStore.token }' action="/api/admin/product/fileUpload"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="TradeParams.logoUrl" :src="TradeParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { reqTradeList, reqAddOrUpdateTrade, reqDeleteTrade } from '@/api/product/trademark/index'
import type { TradeResponseData, Trade, TradeParams } from '@/api/product/trademark/type'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const tradeData = ref<Trade[]>([])
const pageNo = ref<number>(1)
const pageSize = ref<number>(3)
const total = ref<number>(0)
const dialogVisible = ref<boolean>(false)
const formRef = ref<any>()

const TradeParams = ref<TradeParams>({
  tmName: '',
  logoUrl: ''
})

onMounted(() => {
  getHasTrade()
})

const getHasTrade = async (pager = 1) => {
  pageNo.value = pager
  const result: TradeResponseData = await reqTradeList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    tradeData.value = result.data.records
  }
}

const sizeChange = (size: number) => {
  pageSize.value = size
  getHasTrade()
}

const AddTrade = () => {
  dialogVisible.value = true
  Object.assign(TradeParams.value, {
    id: 0,
    tmName: '',
    logoUrl: ''
  })
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  });
}

const Edit = (row: Trade) => {
  dialogVisible.value = true
  Object.assign(TradeParams.value, row)
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  });
}

const rules = {
  tmName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
  ],
  logoUrl: [
    { required: true, message: '请上传品牌LOGO', trigger: 'blur' },
  ]
}

// 上传图片
import type { UploadProps } from 'element-plus'
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  TradeParams.value.logoUrl = response.data
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

const save = async () => {
  await formRef.value.validate()
  const result: any = await reqAddOrUpdateTrade(TradeParams.value)
  console.log(result)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: TradeParams.value.id ? '修改成功' : '添加成功'
    })
    getHasTrade(TradeParams.value.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'error',
      message: TradeParams.value.id ? '修改失败' : '添加失败'
    })
  }
  dialogVisible.value = false
}

const Delete = async (row: Trade) => {
  const result: any = await reqDeleteTrade(row.id as number)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasTrade(tradeData.value.length === 1 ? pageNo.value - 1 : pageNo.value)
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
