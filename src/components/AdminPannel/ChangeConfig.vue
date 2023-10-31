<template>
  <el-form
    ref="changeConfigFormRef"
    :model="changeConfigForm"
    :rules="changeConfigFormRule"
    label-width="auto"
    v-loading="changeConfigForm.getPending"
  >
    <el-form-item label="版本号" prop="version">
      <el-input disabled v-model="changeConfigForm.version"></el-input>
    </el-form-item>
    <el-form-item label="DEBUG模式开关" prop="debug">
      <el-switch v-model="changeConfigForm.debug" size="large" />
    </el-form-item>
    <el-form-item label="强制SSL模式开关" prop="ssl">
      <el-switch v-model="changeConfigForm.ssl" size="large" />
    </el-form-item>
    <el-form-item label="公告开关" prop="announceSwitch">
      <el-switch v-model="changeConfigForm.announceSwitch" size="large" />
    </el-form-item>
    <el-form-item label="公告内容" prop="announce">
      <el-input type="textarea" v-model.trim="changeConfigForm.announce"></el-input>
    </el-form-item>
    <el-form-item label="后台接口前缀" prop="prefix">
      <el-input v-model.trim="changeConfigForm.prefix"></el-input>
    </el-form-item>
    <el-form-item label="下载使用的 User_Agent" prop="userAgent">
      <el-input v-model.trim="changeConfigForm.userAgent"></el-input>
    </el-form-item>
    <el-form-item label="批量解析时休眠时间(秒)" prop="sleep">
      <el-input-number v-model="changeConfigForm.sleep"></el-input-number>
    </el-form-item>
    <el-form-item label="批量解析时单次最大解析数量" prop="maxOnce">
      <el-input-number v-model="changeConfigForm.maxOnce"></el-input-number>
    </el-form-item>
    <el-form-item label="获取列表时的 Cookie" prop="cookie">
      <el-input type="textarea" v-model.trim="changeConfigForm.cookie" rows="5"></el-input>
    </el-form-item>
    <el-form-item label="密码开关" prop="passwordSwitch">
      <el-switch v-model="changeConfigForm.passwordSwitch" size="large" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model.trim="changeConfigForm.password"></el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button
        type="primary"
        @click="changeConfig(changeConfigFormRef)"
        :loading="changeConfigForm.changePending"
      >
        保存
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useChangeConfigStore } from '@/store/AdminPannel/ChangeConfig.js'
import { storeToRefs } from 'pinia'
import { doGetAccountInfo, doChangeConfig, doGetConfig } from '@/apis/admin.js'
import { setPrefix } from '@/utils/env.js'
import type { _response } from '@/utils/request.js'

const changeConfigStore = useChangeConfigStore()
const { changeConfigForm, changeConfigFormRef } = storeToRefs(changeConfigStore)

const passwordValidator = (rule: any, value: string, callback: any) => {
  if (changeConfigForm.value.passwordSwitch) {
    if (value === '') {
      callback(new Error('请输入密码'))
    }
  }
  callback()
}

const announceValidator = (rule: any, value: string, callback: any) => {
  if (changeConfigForm.value.passwordSwitch) {
    if (value === '') {
      callback(new Error('请输入公告内容'))
    }
  }
  callback()
}

const changeConfigFormRule: FormRules = {
  userAgent: [{ required: true, message: '请输入User_Agent', trigger: 'blur' }],
  announce: [{ validator: announceValidator, trigger: 'blur' }],
  announceSwitch: [{ required: true, message: '请确认开关状态', trigger: 'blur' }],
  debug: [{ required: true, message: '请确认开关状态', trigger: 'blur' }],
  ssl: [{ required: true, message: '请确认开关状态', trigger: 'blur' }],
  prefix: [{ required: true, message: '请输入后台接口后缀', trigger: 'blur' }],
  cookie: [{ required: true, message: '请输入获取列表时的 Cookie', trigger: 'blur' }],
  maxOnce: [{ required: true, message: '请输入批量解析时单次最大解析数量', trigger: 'blur' }],
  sleep: [{ required: true, message: '请输入批量解析时休眠时间(秒)', trigger: 'blur' }],
  password: [{ validator: passwordValidator, trigger: 'blur' }],
  passwordSwitch: [{ required: true, message: '请确认开关状态', trigger: 'blur' }]
}

onMounted(async () => await getConfig())

const getConfig = async () => {
  changeConfigForm.value.getPending = true
  const response = (await doGetConfig()) ?? 'failed'
  changeConfigForm.value.getPending = false

  if (response.toString() === 'failed') return

  changeConfigForm.value = { ...changeConfigForm.value, ...(response as _response).data }
}

const changeConfig = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (await formEl.validate(() => {})) {
    changeConfigForm.value.changePending = true

    // 检验cookie是否包含账号
    const accountInfo =
      (await doGetAccountInfo({
        cookie: changeConfigForm.value.cookie,
        check: true
      })) ?? 'failed'

    if (accountInfo.toString() === 'failed') return

    changeConfigForm.value.changePending = false
    if ((accountInfo as _response).message !== 'cookie校验成功') {
      ElMessage.error('请不要使用包含账户的cookie,直接退出登陆获取一个新cookie')
      return
    }
    ElMessage.success('cookie校验成功,不包含账户')

    const response =
      (await doChangeConfig({
        ...changeConfigForm.value
      })) ?? 'failed'

    changeConfigForm.value.changePending = false

    if (response.toString() === 'failed') return

    ElMessage.success('修改成功')
    // 修改后台接口前缀
    setPrefix(changeConfigForm.value.prefix)
    await getConfig()
  }
}
</script>

<style lang="scss" scoped></style>
