<template>
  <el-form
    ref="changeMailConfigFormRef"
    :model="changeMailConfigForm"
    :rules="changeMailConfigFormRule"
    label-width="auto"
    v-loading="pending"
  >
    <el-form-item label="是否开启" prop="switch">
      <el-switch v-model="changeMailConfigForm.switch" size="large" />
    </el-form-item>
    <el-form-item label="SMTP服务器地址" prop="host">
      <el-input v-model="changeMailConfigForm.host"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器加密方式" prop="encryption">
      <el-select v-model="changeMailConfigForm.encryption" placeholder="选择加密方式">
        <el-option key="tls" label="tls" value="tls" />
        <el-option key="ssl" label="ssl" value="ssl" />
      </el-select>
    </el-form-item>
    <el-form-item label="SMTP服务器端口" prop="port">
      <el-input v-model="changeMailConfigForm.port"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器用户名" prop="username">
      <el-input v-model="changeMailConfigForm.username"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器密码" prop="password">
      <el-input v-model="changeMailConfigForm.password"></el-input>
    </el-form-item>
    <el-form-item label="发件人地址" prop="from_address">
      <el-input v-model="changeMailConfigForm.from_address"></el-input>
    </el-form-item>
    <el-form-item label="发件人名称" prop="from_name">
      <el-input v-model="changeMailConfigForm.from_name"></el-input>
    </el-form-item>
    <el-form-item label="收件人名称" prop="to_name">
      <el-input v-model="changeMailConfigForm.to_name"></el-input>
    </el-form-item>
    <el-form-item label="收件人地址" prop="to_address">
      <el-input v-model="changeMailConfigForm.to_address"></el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button type="primary" @click="changeConfig(changeMailConfigFormRef)"> 保存 </el-button>
      <el-button type="primary" @click="sendTestMsg(changeMailConfigFormRef)">
        发送测试邮件
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import * as MailConfigApi from '@/apis/admin/config/mail.js'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const changeMailConfigForm = ref<MailConfigApi.config>({
  switch: false,
  host: '',
  port: '',
  username: '',
  password: '',
  encryption: 'tls',
  from_address: '',
  from_name: '',
  to_address: '',
  to_name: ''
})
const changeMailConfigFormRef = ref<FormInstance | null>(null)
const changeMailConfigFormRule: FormRules = {
  host: [{ required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入SMTP服务器端口', trigger: 'blur' }],
  username: [{ required: true, message: '请输入SMTP服务器账户', trigger: 'blur' }],
  password: [{ required: true, message: '请输入SMTP服务器密码', trigger: 'blur' }],
  encryption: [{ required: true, message: '请选择SMTP服务器加密方式', trigger: 'blur' }],
  from_address: [{ required: true, message: '请输入发件人地址', trigger: 'blur' }],
  from_name: [{ required: true, message: '请输入发件人名称', trigger: 'blur' }],
  to_address: [{ required: true, message: '请输入收件人地址', trigger: 'blur' }],
  to_name: [{ required: true, message: '请输入收件人名称', trigger: 'blur' }]
}

const getConfig = async () => {
  try {
    pending.value = true
    const res = await MailConfigApi.getConfig()
    changeMailConfigForm.value = res.data
  } finally {
    pending.value = false
  }
}
const changeConfig = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await MailConfigApi.updateConfig(changeMailConfigForm.value)
    ElMessage.success('保存成功')
  } finally {
    pending.value = false
    await getConfig()
  }
}

const sendTestMsg = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await changeConfig(formEl)
    await MailConfigApi.sendTestMail()
    ElMessage.success('发送成功,请检查邮箱是否收到')
  } finally {
    pending.value = false
  }
}

onMounted(getConfig)
</script>

<style lang="scss" scoped></style>
