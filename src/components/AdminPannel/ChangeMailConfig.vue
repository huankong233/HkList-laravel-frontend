<template>
  <el-form
    ref="changeMailConfigFormRef"
    :model="changeMailConfigForm"
    :rules="changeMailConfigFormRule"
    label-width="auto"
    v-loading="changeMailConfigForm.pending"
  >
    <el-form-item label="是否开启" prop="mailSwitch">
      <el-switch v-model="changeMailConfigForm.mailSwitch" size="large" />
    </el-form-item>
    <el-form-item label="收件人" prop="mailTo">
      <el-input v-model="changeMailConfigForm.mailTo"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器地址" prop="mailHost">
      <el-input v-model="changeMailConfigForm.mailHost"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器TLS端口" prop="mailPort">
      <el-input v-model="changeMailConfigForm.mailPort"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器用户名" prop="mailUsername">
      <el-input v-model="changeMailConfigForm.mailUsername"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器密码" prop="mailPassword">
      <el-input v-model="changeMailConfigForm.mailPassword"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器发件邮箱" prop="mailFromAddress">
      <el-input v-model="changeMailConfigForm.mailFromAddress"></el-input>
    </el-form-item>
    <el-form-item label="SMTP服务器发件名" prop="mailFromName">
      <el-input v-model="changeMailConfigForm.mailFromName"></el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button
        type="primary"
        @click="changeConfig(changeMailConfigFormRef)"
        :loading="changeMailConfigForm.pending"
      >
        保存
      </el-button>
      <el-button
        type="primary"
        @click="sendTestMsg(changeMailConfigFormRef)"
        :loading="changeMailConfigForm.pending"
      >
        发送测试邮件
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useChangeMailConfigStore } from '@/store/AdminPannel/ChangeMailConfig.js'
import { storeToRefs } from 'pinia'
import { doChangeMailConfig, doGetMailConfig, doSendTestMsg } from '@/apis/admin.js'
import type { _response } from '@/utils/request.js'

const changeMailConfigStore = useChangeMailConfigStore()
const { changeMailConfigForm, changeMailConfigFormRef } = storeToRefs(changeMailConfigStore)

const changeMailConfigFormRule: FormRules = {
  mailSwitch: [{ required: true, message: '请确认是否开启', trigger: 'blur' }],
  mailTo: [{ required: true, message: '请输入收件人', trigger: 'blur' }],
  mailHost: [{ required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }],
  mailPort: [{ required: true, message: '请输入SMTP服务器端口', trigger: 'blur' }],
  mailUsername: [{ required: true, message: '请输入SMTP服务器用户名', trigger: 'blur' }],
  mailPassword: [{ required: true, message: '请输入SMTP服务器密码', trigger: 'blur' }],
  mailFromAddress: [{ required: true, message: '请输入SMTP服务器发件邮箱', trigger: 'blur' }],
  mailFromName: [{ required: true, message: '请输入SMTP服务器发件名', trigger: 'blur' }]
}

onMounted(async () => await getConfig())

const getConfig = async () => {
  changeMailConfigForm.value.pending = true
  const response = (await doGetMailConfig()) ?? 'failed'
  changeMailConfigForm.value.pending = false

  if (response.toString() === 'failed') return

  changeMailConfigForm.value = { ...changeMailConfigForm.value, ...(response as _response).data }
}

const changeConfig = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  changeMailConfigForm.value.pending = true

  const response =
    (await doChangeMailConfig({
      ...changeMailConfigForm.value
    })) ?? 'failed'

  changeMailConfigForm.value.pending = false

  if (response.toString() === 'failed') return

  ElMessage.success('修改成功')
  await getConfig()
}

async function sendTestMsg(formEl: FormInstance | null) {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  await changeConfig(formEl)

  ElMessage.warning('如果发送失败没有看见错误信息请打开debug模式！')

  changeMailConfigForm.value.pending = true

  const response = (await doSendTestMsg()) ?? 'failed'

  changeMailConfigForm.value.pending = false

  if (response.toString() === 'failed') return

  ElMessage.success('发送成功,请检查邮箱是否收到')

  changeMailConfigForm.value.pending = false
}
</script>

<style lang="scss" scoped></style>
