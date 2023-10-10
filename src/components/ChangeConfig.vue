<template>
  <el-form
    ref="changeConfigFormRef"
    :model="changeConfigForm"
    :rules="changeConfigFormRule"
    :disabled="changeConfigForm.getPending"
    label-width="230px"
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
      <el-input type="textarea" v-model="changeConfigForm.announce"></el-input>
    </el-form-item>
    <el-form-item label="后台接口前缀" prop="prefix">
      <el-input v-model="changeConfigForm.prefix"></el-input>
    </el-form-item>
    <el-form-item label="下载使用的 User_Agent" prop="userAgent">
      <el-input v-model="changeConfigForm.userAgent"></el-input>
    </el-form-item>
    <el-form-item label="批量解析时休眠时间(秒)" prop="sleep">
      <el-input-number v-model="changeConfigForm.sleep"></el-input-number>
    </el-form-item>
    <el-form-item label="批量解析时单次最大解析数量" prop="maxOnce">
      <el-input-number v-model="changeConfigForm.maxOnce"></el-input-number>
    </el-form-item>
    <el-form-item label="获取列表时的 Cookie" prop="cookie">
      <el-input type="textarea" v-model="changeConfigForm.cookie" rows="5"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="changeConfig(changeConfigFormRef)"
        :disabled="changeConfigForm.changePending"
        :loading="changeConfigForm.changePending"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useChangeConfigStore } from '@/store/ChangeConfig.js'
import { storeToRefs } from 'pinia'
import { doGetAccountInfo, doChangeConfig, doGetConfig } from '@/apis/admin.js'
import { setPrefix } from '@/utils/env.js'

const changeConfigStore = useChangeConfigStore()
const { changeConfigForm, changeConfigFormRef } = storeToRefs(changeConfigStore)

const changeConfigFormRule = {
  userAgent: [{ required: true, message: '请输入User_Agent', trigger: 'blur' }],
  announce: [{ required: true, message: '请公告内容', trigger: 'blur' }],
  announceSwitch: [{ required: true, message: '请确认开关状态', trigger: 'blur' }],
  debug: [{ required: true, message: '请确认开关状态', trigger: 'blur' }],
  ssl: [{ required: true, message: '请确认开关状态', trigger: 'blur' }],
  prefix: [{ required: true, message: '请输入后台接口后缀', trigger: 'blur' }],
  cookie: [{ required: true, message: '请输入获取列表时的 Cookie', trigger: 'blur' }],
  maxOnce: [{ required: true, message: '请输入批量解析时单次最大解析数量', trigger: 'blur' }],
  sleep: [{ required: true, message: '请输入批量解析时休眠时间(秒)', trigger: 'blur' }]
}

onMounted(async () => await getConfig())

const getConfig = async () => {
  changeConfigForm.value.getPending = true
  const response = (await doGetConfig()) ?? 'failed'
  changeConfigForm.value.getPending = false
  if (response !== 'failed') {
    changeConfigForm.value = { ...changeConfigForm.value, ...response.data }
  }
}

const changeConfig = async (formEl: FormInstance) => {
  if (!formEl) return
  if (await formEl.validate(() => {})) {
    changeConfigForm.value.changePending = true

    // 检验cookie是否包含账号
    const accountInfo =
      (await doGetAccountInfo({
        cookie: changeConfigForm.value.cookie,
        check: true
      })) ?? 'failed'

    if (accountInfo !== 'failed') {
      changeConfigForm.value.changePending = false
      if (accountInfo.message !== 'cookie校验成功') {
        ElMessage.error('请不要使用包含账户的cookie,直接退出登陆获取一个新cookie')
        return
      }
      ElMessage.success('cookie校验成功,不包含账户')
    }

    const response =
      (await doChangeConfig({
        ...changeConfigForm.value
      })) ?? 'failed'

    changeConfigForm.value.changePending = false

    if (response !== 'failed') {
      ElMessage.success('修改成功')
      // 修改后台接口前缀
      setPrefix(changeConfigForm.value.prefix)
      await getConfig()
    }
  }
}
</script>

<style lang="scss" scoped></style>
