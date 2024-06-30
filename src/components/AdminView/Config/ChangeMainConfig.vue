<template>
  <el-form
    ref="changeConfigFormRef"
    :model="changeConfigForm"
    :rules="changeConfigFormRule"
    label-width="auto"
    v-loading="pending"
  >
    <template v-if="Mode === 'main'">
      <el-form-item label="前端版本号" prop="front_end_version">
        <el-input disabled v-model="changeConfigForm.front_end_version"></el-input>
      </el-form-item>
      <el-form-item label="后端版本号" prop="version">
        <el-input disabled v-model="changeConfigForm.version"></el-input>
      </el-form-item>
      <el-form-item label="DEBUG模式开关" prop="debug">
        <el-switch v-model="changeConfigForm.debug" size="large" />
      </el-form-item>
      <el-form-item label="邀请码开关" prop="need_inv_code">
        <el-switch v-model="changeConfigForm.need_inv_code" size="large" />
      </el-form-item>
      <el-form-item label="白名单模式开关" prop="whitelist_mode">
        <el-switch v-model="changeConfigForm.whitelist_mode" size="large" />
      </el-form-item>
      <el-form-item label="站点名称" prop="name">
        <el-input v-model.trim="changeConfigForm.name"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="announce">
        <el-input type="textarea" v-model="changeConfigForm.announce"></el-input>
      </el-form-item>
      <el-form-item label="展示版权" prop="show_copyright">
        <el-switch v-model="changeConfigForm.show_copyright" size="large" />
      </el-form-item>
      <el-form-item label="自定义版权" prop="custom_copyright">
        <el-input v-model="changeConfigForm.custom_copyright" />
      </el-form-item>
      <el-form-item label="卡密模式开关" prop="token_mode">
        <el-switch v-model="changeConfigForm.token_mode" size="large" />
      </el-form-item>
      <el-form-item label="卡网跳转链接" prop="button_link">
        <el-input v-model="changeConfigForm.button_link"></el-input>
      </el-form-item>
    </template>

    <template v-if="Mode === 'parse'">
      <el-form-item label="下载使用的 User_Agent" prop="user_agent">
        <el-input v-model.trim="changeConfigForm.user_agent"></el-input>
      </el-form-item>
      <el-form-item label="批量解析时休眠时间（秒）" prop="sleep">
        <el-input-number v-model="changeConfigForm.sleep"></el-input-number>
      </el-form-item>
      <el-form-item label="批量解析时单次最大解析数量（个）" prop="max_once">
        <el-input-number v-model="changeConfigForm.max_once"></el-input-number>
      </el-form-item>
      <el-form-item label="单日单个账号最大解析大小（GB）" prop="max_filesize">
        <el-input-number
          v-model="changeConfigForm.max_filesize"
          style="width: 300px"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="可解析文件最小需要大小（GB）" prop="max_filesize">
        <el-input-number
          v-model="changeConfigForm.min_single_file"
          style="width: 300px"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="changeConfigForm.password"></el-input>
      </el-form-item>
      <el-form-item label="授权服务器" prop="main_server">
        <el-input v-model.trim="changeConfigForm.main_server"></el-input>
      </el-form-item>
      <el-form-item label="授权码" prop="code">
        <el-input v-model.trim="changeConfigForm.code"></el-input>
      </el-form-item>
      <el-form-item label="解析模式" prop="parse_mode">
        <el-select v-model="changeConfigForm.parse_mode">
          <el-option :value="1" label="盘内" />
          <el-option :value="2" label="盘外V1" />
          <el-option :value="3" label="盘外V2(推荐)" />
        </el-select>
      </el-form-item>
    </template>
    <el-form-item label=" ">
      <el-button type="primary" @click="updateConfig(changeConfigFormRef)">保存</el-button>
      <el-button type="primary" @click="testAuth(changeConfigFormRef)" v-if="Mode === 'parse'">
        测试授权
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import * as mainConfigApi from '@/apis/admin/config/main.js'
import { getFrontEndVersion } from '@/utils/env.js'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { onMounted, ref } from 'vue'

const { Mode } = defineProps(['Mode'])

const pending = ref(false)

const changeConfigForm = ref<mainConfigApi.config>({
  front_end_version: '',
  version: '',
  sleep: 0,
  max_once: 0,
  password: '',
  announce: '',
  user_agent: '',
  need_inv_code: false,
  whitelist_mode: false,
  debug: false,
  name: '',
  code: '',
  main_server: '',
  show_copyright: false,
  parse_mode: 1,
  custom_copyright: '本项目半开源, 项目地址: https://github.com/huankong233/94list-laravel',
  max_filesize: 0,
  min_single_file: 0,
  token_mode: true,
  button_link: ''
})
const changeConfigFormRef = ref<FormInstance | null>(null)
const changeConfigFormRule: FormRules = {
  name: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  sleep: [{ required: true, message: '请输入批量解析时休眠时间(秒)', trigger: 'blur' }],
  max_once: [{ required: true, message: '请输入批量解析时单次最大解析数量', trigger: 'blur' }],
  max_filesize: [{ required: true, message: '请输入单日单个账号最大解析大小', trigger: 'blur' }],
  user_agent: [{ required: true, message: '请输入User_Agent', trigger: 'blur' }]
}

const getConfig = async () => {
  try {
    pending.value = true
    const res = await mainConfigApi.getConfig()
    const data = res.data
    changeConfigForm.value = {
      ...data,
      max_filesize: data.max_filesize / 1024 ** 3,
      min_single_file: data.min_single_file / 1024 ** 3,
      front_end_version: await getFrontEndVersion(),
      announce: data.announce.replaceAll('[NextLine]', '\n')
    }
  } finally {
    pending.value = false
  }
}

const updateConfig = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await mainConfigApi.updateConfig({
      ...changeConfigForm.value,
      max_filesize: changeConfigForm.value.max_filesize * 1024 ** 3,
      min_single_file: changeConfigForm.value.min_single_file * 1024 ** 3
    })
    ElMessage.success('保存成功')
  } finally {
    pending.value = false
    await getConfig()
  }
}

const testAuth = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    const res = await mainConfigApi.testAuth({
      ...changeConfigForm.value,
      max_filesize: changeConfigForm.value.max_filesize * 1024 ** 3,
      min_single_file: changeConfigForm.value.min_single_file * 1024 ** 3
    })
    if ('ip' in res.data) {
      ElMessage.error(`未知授权码,当前ip为: ${res.data.ip}`)
    } else {
      ElMessage.success(`测试通过,有效期至: ${res.data.expired_at}`)
    }
  } finally {
    pending.value = false
    await getConfig()
  }
}

onMounted(getConfig)
</script>

<style lang="scss" scoped></style>
