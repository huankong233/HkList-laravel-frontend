<template>
  <el-dialog title="添加账号" width="60%" v-model="isAddAccount" :before-close="close">
    <el-form
      ref="addAccountFormRef"
      :model="addAccountForm"
      :rules="addAccountFormRule"
      label-width="auto"
      v-loading="pending"
    >
      <el-form-item label="提示">
        <el-text>可以使用换行来分割多个账号</el-text>
      </el-form-item>
      <el-form-item label="账号类型">
        <el-select v-model="addAccountForm.type">
          <el-option label="cookie" :value="1"> </el-option>
          <el-option label="token" :value="2"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Cookie" prop="cookie" v-if="addAccountForm.type === 1">
        <el-input type="textarea" v-model="addAccountForm.cookie"></el-input>
      </el-form-item>
      <el-form-item label="refresh_token" prop="cookie" v-else>
        <el-input type="textarea" v-model="addAccountForm.cookie"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="addAccount(addAccountFormRef)">添加</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as AccountApi from '@/apis/admin/account.js'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits(['getAccounts'])
const isAddAccount = defineModel()

const pending = ref(false)

const addAccountForm = ref<AccountApi.addAccount>({
  type: 1,
  cookie: ''
})
const addAccountFormRef = ref<FormInstance | null>(null)
const addAccountFormRule: FormRules = {
  cookie: [{ required: true, message: '请输入账户信息', trigger: 'blur' }]
}

const addAccount = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    const res = await AccountApi.addAccount(addAccountForm.value)
    if (res.data.have_repeat) ElMessage.info('存在重复的账号,已自动过滤')
    ElMessage.success('添加成功')
  } finally {
    pending.value = false
  }
}

const close = (done: (cancel?: boolean) => {}) => {
  emit('getAccounts')
  done()
}

const cancel = () => {
  isAddAccount.value = false
  emit('getAccounts')
}
</script>

<style lang="scss" scoped></style>
