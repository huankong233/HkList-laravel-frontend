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
      <el-form-item label="站点名称" prop="name">
        <el-input v-model.trim="changeConfigForm.name"></el-input>
      </el-form-item>
      <el-form-item label="公告内容" prop="announce">
        <el-input type="textarea" v-model="changeConfigForm.announce"></el-input>
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
      <el-form-item label="展示版权信息" prop="show_copyright">
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
      <el-form-item label="显示登陆按钮" prop="show_login_button">
        <el-switch v-model="changeConfigForm.show_login_button" size="large" />
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
        <el-input-number v-model="changeConfigForm.max_filesize" style="width: 300px" />
      </el-form-item>
      <el-form-item label="可解析文件最小需要大小（GB）" prop="min_single_filesize">
        <el-input-number v-model="changeConfigForm.min_single_filesize" style="width: 300px" />
      </el-form-item>
      <el-form-item label="可解析文件最大可是大小（GB）" prop="max_single_filesize">
        <el-input-number v-model="changeConfigForm.max_single_filesize" style="width: 300px" />
      </el-form-item>
      <el-form-item label="解析密码" prop="password">
        <el-input v-model.trim="changeConfigForm.password"></el-input>
      </el-form-item>
      <el-form-item label="购买授权联系TG:">
        <el-input disabled value="t.me/huan_kong"></el-input>
      </el-form-item>
      <el-form-item label="授权服务器" prop="main_server">
        <el-input v-model.trim="changeConfigForm.main_server"></el-input>
      </el-form-item>
      <el-form-item label="授权码" prop="code">
        <el-input v-model.trim="changeConfigForm.code"></el-input>
      </el-form-item>
      <el-form-item label="代理下载服务器" prop="proxy_server">
        <el-input v-model.trim="changeConfigForm.proxy_server"></el-input>
      </el-form-item>
      <el-form-item label="代理下载服务器密码" prop="proxy_password">
        <el-input v-model.trim="changeConfigForm.proxy_password"></el-input>
      </el-form-item>
      <el-form-item label="解析模式" prop="parse_mode">
        <el-select
          v-model="changeConfigForm.parse_mode"
          @blur="matchUserAgent"
          @change="matchUserAgent"
        >
          <!-- <el-option :value="3" label="V3盘外(钓鱼禁用)" disabled /> -->
          <!-- <el-option :value="4" label="V4盘外(钓鱼禁用)" disabled /> -->
          <el-option :value="5" label="V5盘内(开放平台接口)" />
          <el-option :value="10" label="V10盘内(开放平台接口)" />

          <el-option :value="1" label="V1盘内(原版V1,qdall下载可能失败,Windows)" />
          <el-option :value="6" label="V6盘内(改版V1,一定程度防风控)" />
          <el-option :value="8" label="V8盘内(改版V1,qdall下载可能失败,Android)" />

          <el-option :value="2" label="V2盘外(原版V2,qdall下载可能失败,Android)" />
          <el-option :value="7" label="V7盘外(改版V2,一定程度防风控)" />
          <el-option :value="9" label="V9盘外(改版V2,qdall下载可能失败,Windows)" />
        </el-select>
      </el-form-item>
      <el-form-item label="省份模式开关" prop="limit_prov">
        <el-switch v-model="changeConfigForm.limit_prov" size="large" />
      </el-form-item>
      <el-form-item label="仅限中国用户使用" prop="limit_cn">
        <el-switch v-model="changeConfigForm.limit_cn" size="large" />
      </el-form-item>
      <el-form-item label="卡密绑定ip" prop="token_bind_ip">
        <el-switch v-model="changeConfigForm.token_bind_ip" size="large" />
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
import { storeToRefs } from 'pinia'
import { useChangeConfigForm } from '@/stores/changeConfigForm.js'

const { Mode } = defineProps(['Mode'])

const pending = ref(false)

const changeConfigFormStore = useChangeConfigForm()
const { changeConfigForm } = storeToRefs(changeConfigFormStore)

const changeConfigFormRef = ref<FormInstance | null>(null)
const changeConfigFormRule: FormRules = {
  name: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  sleep: [{ required: true, message: '请输入批量解析时休眠时间', trigger: 'blur' }],
  max_once: [{ required: true, message: '请输入批量解析时单次最大解析数量', trigger: 'blur' }],
  max_filesize: [{ required: true, message: '请输入单日单个账号最大解析大小', trigger: 'blur' }],
  min_single_filesize: [
    { required: true, message: '请输入可解析文件最小需要大小', trigger: 'blur' }
  ],
  max_single_filesize: [
    { required: true, message: '请输入可解析文件最大可是大小', trigger: 'blur' }
  ],
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
      min_single_filesize: data.min_single_filesize / 1024 ** 3,
      max_single_filesize: data.max_single_filesize / 1024 ** 3,
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
      min_single_filesize: changeConfigForm.value.min_single_filesize * 1024 ** 3,
      max_single_filesize: changeConfigForm.value.max_single_filesize * 1024 ** 3
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
      min_single_filesize: changeConfigForm.value.min_single_filesize * 1024 ** 3,
      max_single_filesize: changeConfigForm.value.max_single_filesize * 1024 ** 3
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

const matchUserAgent = () => {
  let ua = ''
  switch (changeConfigForm.value.parse_mode) {
    case 5:
      ua = 'pan.baidu.com'
      break
    case 1:
    case 8:
      ua = 'netdisk;P2SP;3.0.10.22'
      break
    case 6:
    case 7:
      ua = 'netdisk;P2SP;3.0.10.22;netdisk;4.32.1;PC;PC-Windows;10.0.19045;UniBaiduYunGuanJia'
      break
    case 2:
    case 9:
      ua = 'netdisk;12.11.9;23049RAD8C;android-android;13;JSbridge4.4.0;jointBridge;1.1.0;'
      break
    case 10:
      ua = 'Mozilla/5.0 (94list-laravel;netdisk;svip)'
      break
    default:
      ua = 'netdisk;P2SP;3.0.10.22'
      break
  }
  changeConfigForm.value.user_agent = ua
}
</script>

<style lang="scss" scoped></style>
