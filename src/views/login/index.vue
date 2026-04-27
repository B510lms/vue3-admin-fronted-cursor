<template>
  <div class="login-page">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password :prefix-icon="Lock" />
          </el-form-item>
          <el-button class="login-btn" type="primary" @click="handleLogin">登录</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user'
import { Lock, User } from '@element-plus/icons-vue'

const formRef = ref<FormInstance>()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const form = reactive({ username: 'admin', password: '111111' })

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { required: true, min: 3, message: '用户名长度需要大于等于3', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { required: true, min: 6, message: '密码长度需要大于等于6', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  await formRef.value?.validate()
  await userStore.userLogin(form)
  ElMessage.success('登录成功')
  const redirect = (route.query.redirect as string) || '/'
  router.push(redirect)
}
</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login-form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
      font-weight: 400;
    }

    h2 {
      color: white;
      font-size: 20px;
      font-weight: 400;
      margin: 0 0 20px 0;
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>
