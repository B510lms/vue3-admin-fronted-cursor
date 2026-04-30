<template>
  <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="角色名称:" prop="roleName">
        <el-input v-model="search.roleName" placeholder="请输入角色名称" @keyup.enter="Search"
          style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Search" :disabled="!search.roleName">搜索</el-button>
        <el-button type="primary" @click="Reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px;">
    <el-button type="primary" icon="Plus" @click="AddRole" v-has="'btn.Role.add'">添加角色</el-button>
    <el-table border style="margin: 10px 0;" :data="roleList">
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="ID" prop="id" align="center"></el-table-column>
      <el-table-column label="职位名称" prop="roleName" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="Assign(row)"
            v-has="'btn.Role.assgin'">分配权限</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="Edit(row)" v-has="'btn.Role.update'">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.roleName}吗？`" width="260px" @confirm="Delete(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete" v-has="'btn.Role.remove'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasRole"
      @size-change="SizeChange" />
  </el-card>
  <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新角色' : '添加角色'">
    <el-form :model="RoleParams" :rules="rules" ref="formRef">
      <el-form-item label="角色名称:" prop="roleName">
        <el-input v-model="RoleParams.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">确认</el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="drawerVisible" title="分配菜单权限与按钮权限">
    <el-tree ref="tree" :data="data" show-checkbox node-key="id" default-expand-all :default-checked-keys="selectedNode"
      :props="defaultProps" />
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmClick">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue'
import { reqRoleList, reqAddOrUpdateRole, reqDeleteRole, reqGetPermissionList, reqAssignPermission } from '@/api/acl/role'
import type { RoleResponseData, Role, RoleParams, PermissionResponseData, Permission, AssignPermissionParams } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'

const pageNo = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const dialogVisible = ref<boolean>(false)
const drawerVisible = ref<boolean>(false)
const roleList = ref<Role[]>([])
let formRef = ref<any>()
let tree = ref<any>()
const defaultProps = {
  children: 'children',
  label: 'name',
}
const data = ref<Permission[]>([])
const selectedNode = ref<number[]>([])

const search = reactive({
  roleName: '',
})

const rules = {
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
  ],
}

const RoleParams = reactive<RoleParams>({
  id: 0,
  roleName: '',
})

onMounted(() => {
  getHasRole()
})

const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  const result: RoleResponseData = await reqRoleList(pageNo.value, pageSize.value, search.roleName)
  if (result.code === 200) {
    total.value = result.data.total
    roleList.value = result.data.records
  }
}

const SizeChange = (size: number) => {
  pageSize.value = size
  getHasRole()
}

const Search = () => {
  getHasRole()
}

const Reset = () => {
  search.roleName = ''
  getHasRole()
}

const AddRole = () => {
  dialogVisible.value = true
  Object.assign(RoleParams, {
    id: 0,
    roleName: '',
  })
  // 必须清除掉信息和表单校验
  nextTick(() => {
    formRef.value.clearValidate('roleName')
  });
}

const Edit = (row: Role) => {
  dialogVisible.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    formRef.value.clearValidate('roleName')
  });
}

const cancel = () => {
  dialogVisible.value = false
}

const save = async () => {
  await formRef.value.validate()
  const result: any = await reqAddOrUpdateRole(RoleParams)
  dialogVisible.value = false
  if (result.code === 200) {
    ElMessage({ type: 'success', message: RoleParams.id ? '修改成功' : '添加成功' })
  } else {
    ElMessage({ type: 'error', message: RoleParams.id ? '修改失败' : '添加失败' })
  }
  getHasRole(RoleParams.id ? pageNo.value : 1)
}

// 删除
const Delete = async (id: number) => {
  const result: any = await reqDeleteRole(id)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    await getHasRole(roleList.value.length > 1 ? pageNo.value : 1)
  } else {
    ElMessage({ type: 'error', message: result.message ?? '删除失败' })
  }
}

// 分配权限
const Assign = async (row: Role) => {
  Object.assign(RoleParams, row)
  const result: PermissionResponseData = await reqGetPermissionList(row.id as number)
  if (result.code === 200) {
    data.value = result.data
    selectedNode.value = filterTreeNode(data.value, [])
  }
  drawerVisible.value = true
}

const filterTreeNode = (tree: Permission[], checkedNode: number[]) => {
  tree.forEach(item => {
    if (item.select && !item.children) {
      checkedNode.push(item.id as number)
    }
    if (item.children) {
      filterTreeNode(item.children, checkedNode)
    }
  })
  return checkedNode
}

const confirmClick = async () => {
  const arr1 = tree.value.getCheckedKeys()
  const arr2 = tree.value.getHalfCheckedKeys()
  const permissionId = arr1.concat(arr2)
  const assignPermissionParams: AssignPermissionParams = {
    permissionId,
    roleId: RoleParams.id as number,
  }
  const result: any = await reqAssignPermission(assignPermissionParams)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '分配权限成功' })
  } else {
    ElMessage({ type: 'error', message: result.message ?? '分配权限失败' })
  }
  drawerVisible.value = false
  getHasRole(pageNo.value)
}
</script>

<style scoped lang="scss">
.demo-form-inline {
  display: flex;
  justify-content: space-between;
}
</style>
