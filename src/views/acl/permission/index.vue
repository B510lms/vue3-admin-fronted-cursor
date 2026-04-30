<template>
  <el-card>
    <el-table :data="permissionData" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="code" label="权限值"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间"></el-table-column>
      <el-table-column label="操作">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="Plus" :disabled="row.level === 4" @click="AddPermission(row)"
            v-has="'btn.Permission.add'">
            {{ row.level === 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button type="primary" size="small" icon="Edit" :disabled="row.level === 1" @click="Edit(row)"
            v-has="'btn.Permission.update'">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.name}吗?`" @confirm="Delete(row)" width="260px">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" :disabled="row.level === 1"
                v-has="'btn.Permission.remove'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog v-model="dialogVisible" title="添加权限">
    <el-form :model="PermissionParams" :rules="rules" ref="formRef">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="PermissionParams.name" placeholder="请输入权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限数值" prop="code">
        <el-input v-model="PermissionParams.code" placeholder="请输入权限数值"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqGetPermissionList, reqAddOrUpdatePermission, reqRemovePermission } from '@/api/acl/permission'
import type { Permission, PermissionResponseData, PermissionParams } from '@/api/acl/permission/type'
import { ElMessage } from 'element-plus'

const permissionData = ref<Permission[]>([])
const dialogVisible = ref<boolean>(false)
const formRef = ref<any>()
const PermissionParams = ref<PermissionParams>({
  id: 0,
  code: '',
  name: '',
  pid: 0,
  level: 0,
  type: 1
})

onMounted(() => {
  getPermissionList()
})

const getPermissionList = async () => {
  const result: PermissionResponseData = await reqGetPermissionList()
  if (result.code === 200) {
    permissionData.value = result.data
  }
}

const rules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限数值', trigger: 'blur' }]
}

const AddPermission = (row: Permission) => {
  Object.assign(PermissionParams.value, {
    id: 0,
    code: '',
    name: '',
    pid: row.id,
    level: row.level + 1,
    type: 1,
  })
  dialogVisible.value = true
  formRef.value.clearValidate("name")
  formRef.value.clearValidate("code")
}

const Edit = (row: Permission) => {
  Object.assign(PermissionParams.value, row)
  dialogVisible.value = true
  formRef.value.clearValidate("name")
  formRef.value.clearValidate("code")
}

const Delete = async (row: Permission) => {
  const result: any = await reqRemovePermission(row.id as number)
  if (result.code === 200) {
    getPermissionList()
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  }
}

const save = async () => {
  await formRef.value.validate()
  const result: any = await reqAddOrUpdatePermission(PermissionParams.value)
  if (result.code === 200) {
    dialogVisible.value = false
    getPermissionList()
    ElMessage({
      type: 'success',
      message: PermissionParams.value.id ? '修改成功' : '添加成功'
    })
  }
}
</script>

<style scoped lang="scss"></style>
