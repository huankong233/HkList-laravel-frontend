<template>
  <div class="container">
    <el-card v-loading="pending">
      <h1>
        <img :src="favicon" alt="logo" />
      </h1>
      <h2>注册 | {{ getAppName() }}</h2>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerFormRule"
        label-width="auto"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" @keyup.enter="submitForm(registerFormRef)" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            @keyup.enter="submitForm(registerFormRef)"
          />
        </el-form-item>
        <el-form-item label="邀请码" prop="inv_code" v-if="userStore.config.need_inv_code">
          <el-input v-model="registerForm.inv_code" @keyup.enter="submitForm(registerFormRef)" />
        </el-form-item>
        <el-form-item class="center">
          <el-button type="primary" @click="goLogin()">登陆</el-button>
          <el-button type="primary" @click="submitForm(registerFormRef)">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import * as UserApi from '@/apis/user/user.js'
import favicon from '@/assets/image/favicon.ico'
import { useMainStore } from '@/stores/mainStore.js'
import { getAppName, getLoginState } from '@/utils/env.js'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
if (getLoginState() === '1') router.push('/admin')
const goLogin = () => router.push('/login')

const pending = ref(false)
const registerForm = ref({ username: '', password: '', inv_code: '' })
const registerFormRef = ref<FormInstance | null>(null)
const registerFormRule: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const userStore = useMainStore()
if (userStore.config.need_inv_code) {
  registerFormRule['inv_code'] = [{ required: true, message: '请输入邀请码', trigger: 'blur' }]
}

const submitForm = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true

    await UserApi.register({
      username: registerForm.value.username,
      password: registerForm.value.password,
      inv_code: registerForm.value.inv_code
    })

    ElMessage.success('注册成功')
    router.push('/login')
  } finally {
    pending.value = false
  }
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
