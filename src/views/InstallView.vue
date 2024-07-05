<template>
  <div class="container">
    <el-card>
      <h1>
        <img :src="favicon" alt="logo" />
      </h1>
      <h2>安装 | {{ getAppName() }}</h2>

      <h3 v-if="installed">
        <p>您的后台登录账号密码均为:admin,请及时登录修改!</p>
        <el-button type="primary" @click="goHome()">访问首页</el-button>
        <el-button type="success" @click="goAdmin()">访问后台</el-button>
      </h3>

      <el-form
        ref="installFormRef"
        :model="installForm"
        :rules="installFormRule"
        :disabled="installed"
        label-width="auto"
      >
        <el-form-item label="网站名称" prop="app_name">
          <el-input v-model="installForm.app_name"></el-input>
        </el-form-item>

        <el-form-item label="数据库驱动" prop="db_connection">
          <el-select v-model="installForm.db_connection" placeholder="请选择数据库驱动">
            <el-option label="MySQL" value="mysql"></el-option>
            <el-option label="SQLite" value="sqlite"></el-option>
          </el-select>
        </el-form-item>

        <template v-if="installForm.db_connection === 'mysql'">
          <el-form-item label="MySQL 数据库地址" prop="db_host">
            <el-input v-model="installForm.db_host"></el-input>
          </el-form-item>
          <el-form-item label="MySQL 端口" prop="db_port">
            <el-input v-model="installForm.db_port"></el-input>
          </el-form-item>
          <el-form-item label="MySQL 数据库名" prop="db_database">
            <el-input v-model="installForm.db_database"></el-input>
          </el-form-item>
          <el-form-item label="MySQL 用户名" prop="db_username">
            <el-input v-model="installForm.db_username"></el-input>
          </el-form-item>
          <el-form-item label="MySQL 密码" prop="db_password">
            <el-input v-model="installForm.db_password"></el-input>
          </el-form-item>
        </template>
        <el-form-item class="center">
          <el-button type="primary" @click="install(installFormRef)" :loading="pending">
            安装
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import * as InstallApi from '@/apis/install.js'
import favicon from '@/assets/image/favicon.ico'
import { getAppName } from '@/utils/env.js'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const installForm = ref<InstallApi.install>({
  db_connection: 'mysql',
  db_host: 'localhost',
  db_port: '3306',
  db_database: '94list-laravel',
  db_username: '94list-laravel',
  db_password: '',
  app_name: '94list-laravel'
})

const installFormRef = ref<FormInstance | null>(null)

const installFormRule: FormRules = {
  db_connection: [{ required: true, message: '请选择安装方式', trigger: 'change' }],
  db_host: [{ required: true, message: '请输入MySQL 数据库地址', trigger: 'blur' }],
  db_port: [{ required: true, message: '请输入MySQL 端口', trigger: 'blur' }],
  db_database: [{ required: true, message: '请输入MySQL 数据库名', trigger: 'blur' }],
  db_username: [{ required: true, message: '请输入MySQL 用户名', trigger: 'blur' }],
  // db_password: [{ required: true, message: '请输入MySQL 密码', trigger: 'blur' }],
  app_name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }]
}

const pending = ref(false)
const installed = ref(false)

const install = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await InstallApi.install(installForm.value)
    ElMessage.success('安装成功!')
    installed.value = true
  } finally {
    pending.value = false
  }
}

const router = useRouter()
const goHome = () => router.push('/')
const goAdmin = () => router.push('/login')
</script>

<style lang="scss" scoped>
.container {
  max-width: 515px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  margin: 0 0 15px 0;
}
</style>
