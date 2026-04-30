<template>
  <el-card>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="用户名称:" prop="username">
        <el-input v-model="search.username" placeholder="请输入用户名称" @keyup.enter="Search"
          style="width: 250px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Search" :disabled="!search.username">搜索</el-button>
        <el-button type="primary" @click="Reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px;">
    <el-button type="primary" @click="AddUser" v-has="'btn.User.add'">添加用户</el-button>
    <el-popconfirm :title="`你确定批量删除 ${selectedUserIds.length} 条数据吗？`" width="260px" @confirm="BatchRemove">
      <template #reference>
        <el-button type="danger" :disabled="selectedUserIds.length === 0" v-has="'btn.User.remove'">批量删除</el-button>
      </template>
    </el-popconfirm>
    <el-table border style="margin: 10px 0;" :data="userList" @selection-change="SelectedIds">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
      <el-table-column label="ID" prop="id" align="center"></el-table-column>
      <el-table-column label="用户名称" prop="username" align="center"></el-table-column>
      <el-table-column label="用户昵称" prop="name" align="center"></el-table-column>
      <el-table-column label="用户角色" prop="roleName" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template #="{ row }">
          <el-button type="primary" size="small" icon="User" @click="Assign(row)"
            v-has="'btn.User.assgin'">分配角色</el-button>
          <el-button type="warning" size="small" icon="Edit" @click="Edit(row)" v-has="'btn.User.update'">编辑</el-button>
          <el-popconfirm :title="`你确定要删除[${row.username}]吗？`" width="260px" @confirm="Delete(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" v-has="'btn.User.remove'">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
      @current-change="getHasUser" @size-change="SizeChange" />
  </el-card>
  <el-drawer v-model="drawerVisible" :title="UserParams.id ? '编辑用户' : '添加用户'">
    <el-form :model="UserParams" :rules="rules" ref="formRef">
      <el-form-item label="用户名称:" prop="username">
        <el-input v-model="UserParams.username" placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称:" prop="name">
        <el-input v-model="UserParams.name" placeholder="请输入用户昵称"></el-input>
      </el-form-item>
      <el-form-item label="用户密码:" prop="password" v-if="!UserParams.id">
        <el-input v-model="UserParams.password" placeholder="请输入密码"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">确认</el-button>
    </template>
  </el-drawer>
  <el-drawer v-model="drawerRole" title="分配角色">
    <el-form>
      <el-form-item label="用户名称:">
        <el-input v-model="UserParams.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="分配角色:"">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
        @change="handleCheckAllChange">全部</el-checkbox>
        <el-checkbox-group v-model="checkedRole" @change="handleCheckedRoleChange">
          <el-checkbox v-for="item in allRole" :key="item.id" :value="item">
            {{ item.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerRole = false">取消</el-button>
      <el-button type="primary" @click="confirmClick">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue'
import { reqUser, reqAddOrUpdateUser, reqDeleteUser, reqBatchRemoveUser, reqGetRoleList, reqAssignRole } from '@/api/acl/user'
import type { UserResponseData, User, UserParams, Role, GetRoleResopnse, AssignRoleParams } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'

const pageNo = ref<number>(1)
const pageSize = ref<number>(3)
const total = ref<number>(0)
const drawerVisible = ref<boolean>(false)
const drawerRole = ref<boolean>(false)
const userList = ref<User[]>([])
const selectedUserIds = ref<number[]>([])
let formRef = ref<any>()
let checkedRole = ref<Role[]>([])
let allRole = ref<Role[]>([])

const search = reactive({
  username: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, message: '长度在 5 个字符以上', trigger: 'blur' }
  ]
}

const UserParams = reactive<UserParams>({
  id: 0,
  name: '',
  username: '',
  password: '',
})

onMounted(() => {
  getHasUser()
})

const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  const result: UserResponseData = await reqUser(pageNo.value, pageSize.value, search.username)
  if (result.code === 200) {
    total.value = result.data.total
    userList.value = result.data.records
  }
}

const SizeChange = (size: number) => {
  pageSize.value = size
  getHasUser()
}

const Search = () => {
  getHasUser()
}

const Reset = () => {
  search.username = ''
  getHasUser()
}

const AddUser = () => {
  drawerVisible.value = true
  Object.assign(UserParams, {
    id: 0,
    name: '',
    username: '',
    password: '',
  })
  // 必须清除掉信息和表单校验
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  });
}

const Edit = (row: any) => {
  drawerVisible.value = true
  Object.assign(UserParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  });
}

const cancel = () => {
  drawerVisible.value = false
}

const save = async () => {
  await formRef.value.validate()
  const result: any = await reqAddOrUpdateUser(UserParams)
  drawerVisible.value = false
  if (result.code === 200) {
    ElMessage({ type: 'success', message: UserParams.id ? '修改成功' : '添加成功' })
  } else {
    ElMessage({ type: 'error', message: UserParams.id ? '修改失败' : '添加失败' })
  }
  getHasUser(UserParams.id ? pageNo.value : 1)
}

// 删除
const Delete = async (id: number) => {
  const result: any = await reqDeleteUser(id)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    await getHasUser(userList.value.length > 1 ? pageNo.value : 1)
  } else {
    ElMessage({ type: 'error', message: result.message ?? '删除失败' })
  }
}

// 批量删除
const SelectedIds = (value: User[]) => {
  selectedUserIds.value = value.map(item => item.id) as number[]
}

const BatchRemove = async () => {
  const result: any = await reqBatchRemoveUser(selectedUserIds.value)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '批量删除成功' })
    await getHasUser(userList.value.length > 1 ? pageNo.value : 1)
    selectedUserIds.value = []
  } else {
    ElMessage({ type: 'error', message: result.message ?? '批量删除失败' })
  }
}

// 分配角色
import type { CheckboxValueType } from 'element-plus'
const checkAll = ref(false)
const isIndeterminate = ref(true)

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedRoleChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

const Assign = async (row: any) => {
  Object.assign(UserParams, row)
  const result: GetRoleResopnse = await reqGetRoleList(row.id)
  if (result.code === 200) {
    allRole.value = result.data.allRolesList
    checkedRole.value = result.data.assignRoles
  }
  drawerRole.value = true
}

const confirmClick = async () => {
  const assignRoleParams: AssignRoleParams = {
    roleIdList: checkedRole.value.map(item => item.id) as number[],
    userId: UserParams.id as number,
  }
  const result: any = await reqAssignRole(assignRoleParams)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '分配角色成功' })
  } else {
    ElMessage({ type: 'error', message: result.message ?? '分配角色失败' })
  }
  drawerRole.value = false
  getHasUser(pageNo.value)
}
</script>

<style scoped lang="scss">
.demo-form-inline {
  display: flex;
  justify-content: space-between;
}
</style>
