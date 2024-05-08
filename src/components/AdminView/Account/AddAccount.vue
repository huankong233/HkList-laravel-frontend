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
        <el-text> 可以使用换行来分割多个账号 </el-text>
      </el-form-item>
      <el-form-item label="Cookie" prop="cookie">
        <el-input type="textarea" v-model.trim="addAccountForm.cookie"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="addAccount(addAccountFormRef)"> 添加 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as AccountApi from '@/apis/admin/account.js'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits(['getAccounts'])
const isAddAccount = defineModel()

const pending = ref(false)

const addAccountForm = ref<{ cookie: string }>({
  cookie: ''
})
const addAccountFormRef = ref<FormInstance | null>(null)
const addAccountFormRule = {
  cookie: [{ required: true, message: '请输入Cookie', trigger: 'blur' }]
}

const addAccount = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await AccountApi.addAccount({
      cookie: addAccountForm.value.cookie.split('\n')
    })
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
