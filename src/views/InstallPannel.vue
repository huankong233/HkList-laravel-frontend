<template>
  <div class="container">
    <el-card>
      <h1>
        <img src="favicon.ico" alt="logo" />
      </h1>
      <h2>就是加速</h2>
      <h3 v-if="installForm.installed">
        <p>您的后台登录账号密码均为:admin,请及时登录修改!</p>
        <el-button type="danger" @click="goHome()">访问首页</el-button>
        <el-button type="success" @click="goAdmin()">访问后台</el-button>
      </h3>
      <el-form
        ref="installFormRef"
        v-bind:model="installForm"
        v-bind:rules="installFormRule"
        v-bind:disabled="installForm.installed"
        label-width="150px"
      >
        <el-form-item label="数据库驱动" prop="db_type">
          <el-select v-model="installForm.db_type" placeholder="请选择数据库驱动">
            <el-option label="MySQL" value="mysql"></el-option>
            <el-option label="SQLite" value="sqlite"></el-option>
          </el-select>
        </el-form-item>

        <template v-if="installForm.db_type === 'mysql'">
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
        <el-form-item label="后台登录路径" prop="admin_path">
          <el-input v-model="installForm.admin_path"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-on:click="install(installFormRef)"
            v-bind:loading="installForm.pending"
          >
            安装
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { doInstall } from '@/apis'

const installForm = ref({
  db_type: '',
  db_host: 'localhost',
  db_port: '3306',
  db_database: '94list',
  db_username: '94list',
  db_password: '',
  app_name: '94list-laravel',
  app_url: '',
  admin_path: '/admin',
  pending: false,
  installed: false
})

const installFormRef = ref<FormInstance | null>(null)

const installFormRule: FormRules = {
  db_type: [{ required: true, message: '请选择安装方式', trigger: 'change' }],
  db_host: [{ required: true, message: '请输入MySQL 数据库地址', trigger: 'blur' }],
  db_port: [{ required: true, message: '请输入MySQL 端口', trigger: 'blur' }],
  db_database: [{ required: true, message: '请输入MySQL 数据库名', trigger: 'blur' }],
  db_username: [{ required: true, message: '请输入MySQL 用户名', trigger: 'blur' }],
  db_password: [{ required: true, message: '请输入MySQL 密码', trigger: 'blur' }],
  app_name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  app_url: [{ required: true, message: '请输入网站url', trigger: 'blur' }],
  admin_path: [{ required: true, message: '请输入后台登录路径', trigger: 'blur' }]
}

const install = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return
  installForm.value.pending = true

  doInstall({
    db_type: installForm.value.db_type,
    db_host: installForm.value.db_host,
    db_port: installForm.value.db_port,
    db_database: installForm.value.db_database,
    db_username: installForm.value.db_username,
    db_password: installForm.value.db_password,
    app_name: installForm.value.app_name,
    app_url: installForm.value.app_url,
    admin_path: installForm.value.admin_path
  }).then(() => {
    ElMessage.success('安装成功!')
    installForm.value.installed = true
  })

  installForm.value.pending = false
}

const goHome = () => (location.href = '/')
const goAdmin = () => (location.href = installForm.value.admin_path)
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
