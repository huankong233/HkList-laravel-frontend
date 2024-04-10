<template>
  <div class="container">
    <el-card>
      <h1>
        <img :src="favicon" alt="logo" />
      </h1>
      <h2>{{ getAppName() }}</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule" label-width="auto">
        <el-form-item label="路由前缀" prop="prefix">
          <el-input v-model="loginForm.prefix"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="center">
          <el-button
            type="primary"
            @click="login(loginFormRef)"
            :disabled="loginForm.pending"
            :loading="loginForm.pending"
          >
            登陆
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useLoginPannelStore } from '@/store/LoginPannel.js'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { doLogin } from '@/apis/admin.js'
import { getAppName, setPrefix } from '@/utils/env.js'
import { getLoginState, setLoginState } from '@/utils/env.js'
import favicon from '@/assets/image/favicon.ico'

const router = useRouter()

if (getLoginState() === '1') router.push('/admin')

const loginPannel = useLoginPannelStore()
const { loginForm, loginFormRef } = storeToRefs(loginPannel)

const loginFormRule: FormRules = {
  prefix: [{ required: true, message: '请输入路由前缀', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const login = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  setPrefix(loginForm.value.prefix)

  loginForm.value.pending = true

  const response =
    (await doLogin({
      username: loginForm.value.username,
      password: loginForm.value.password
    })) ?? 'failed'

  loginForm.value.pending = false

  if (response.toString() === 'failed') return

  loginForm.value.username = ''
  loginForm.value.password = ''
  ElMessage.success('登陆成功')
  setLoginState('1')
  router.push('/admin')
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 515px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h2 {
  margin: 0 0 15px 0;
}
</style>
