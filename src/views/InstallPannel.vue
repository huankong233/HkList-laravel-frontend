<template>
  <div class="container">
    <el-card>
      <h1>
        <img :src="favicon" alt="logo" />
      </h1>
      <h2>就是加速</h2>
      <h3 v-if="installForm.installed">
        <p>您的后台登录账号密码均为:admin,请及时登录修改!</p>
        <el-button type="danger" @click="goHome()">访问首页</el-button>
        <el-button type="success" @click="goAdmin()">访问后台</el-button>
      </h3>
      <el-form
        ref="installFormRef"
        :model="installForm"
        :rules="installFormRule"
        :disabled="installForm.installed"
        label-width="auto"
      >
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

        <el-divider></el-divider>

        <el-form-item label="网站名称" prop="app_name">
          <el-input v-model="installForm.app_name"></el-input>
        </el-form-item>
        <el-form-item label="网站url" prop="app_url">
          <el-input v-model="installForm.app_url"></el-input>
        </el-form-item>
        <el-form-item label="后台登录路径" prop="admin_route_prefix">
          <el-input v-model="installForm.admin_route_prefix"></el-input>
        </el-form-item>
        <el-form-item class="center">
          <el-button type="primary" @click="install(installFormRef)" :loading="installForm.pending">
            安装
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { doInstall } from '@/apis/user.js'
import { useInstallPannelStore } from '@/store/InstallPannel.js'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import favicon from '@/assets/image/favicon.ico'
const router = useRouter()

const installPannel = useInstallPannelStore()
const { installForm, installFormRef } = storeToRefs(installPannel)

const installFormRule: FormRules = {
  db_connection: [{ required: true, message: '请选择安装方式', trigger: 'change' }],
  db_host: [{ required: true, message: '请输入MySQL 数据库地址', trigger: 'blur' }],
  db_port: [{ required: true, message: '请输入MySQL 端口', trigger: 'blur' }],
  db_database: [{ required: true, message: '请输入MySQL 数据库名', trigger: 'blur' }],
  db_username: [{ required: true, message: '请输入MySQL 用户名', trigger: 'blur' }],
  db_password: [{ required: true, message: '请输入MySQL 密码', trigger: 'blur' }],
  app_name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  app_url: [{ required: true, message: '请输入网站url', trigger: 'blur' }],
  admin_route_prefix: [{ required: true, message: '请输入后台登录路径', trigger: 'blur' }]
}

const install = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  installForm.value.pending = true
  const response =
    (await doInstall({
      db_connection: installForm.value.db_connection,
      db_host: installForm.value.db_host,
      db_port: installForm.value.db_port,
      db_database: installForm.value.db_database,
      db_username: installForm.value.db_username,
      db_password: installForm.value.db_password,
      app_name: installForm.value.app_name,
      app_url: installForm.value.app_url,
      admin_route_prefix: installForm.value.admin_route_prefix
    })) ?? 'failed'
  installForm.value.pending = false

  if (response.toString() === 'failed') return

  ElMessage.success('安装成功!')
  installForm.value.installed = true
}

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
