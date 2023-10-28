<template>
  <el-dialog v-model="addAccountFormVisible" title="添加代理账号" width="60%">
    <el-form
      ref="addAccountFormRef"
      :model="addAccountForm"
      :rules="addAccountFormRule"
      label-width="auto"
    >
      <el-form-item label="账户Cookie" prop="cookie">
        <el-input
          type="textarea"
          v-model.trim="addAccountForm.cookie"
          rows="5"
          @input="clearState()"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号名称" prop="username">
        <el-input v-model="addAccountForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="账号等级" prop="vipType">
        <el-input v-model="addAccountForm.vipType" disabled></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="accountManagement.closeAddDialog()">取消</el-button>
      <el-button
        type="primary"
        @click="getAccountInfo(addAccountFormRef)"
        :disabled="addAccountForm.checkedInfo"
        :loading="addAccountForm.checkPending"
      >
        获取账户信息
      </el-button>
      <el-button
        type="primary"
        @click="addAccount(addAccountFormRef)"
        :disabled="!addAccountForm.checkedInfo"
        :loading="addAccountForm.addPending"
      >
        添加
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'

import type { _response } from '@/utils/request.js'
import { storeToRefs } from 'pinia'
import { useAccountManagementStore } from '@/store/AdminPannel/AccountManagement.js'
import { doAddAccount, doGetAccountInfo } from '@/apis/admin.js'
import { ElMessage } from 'element-plus'

const accountManagement = useAccountManagementStore()
const { addAccountForm, addAccountFormRef, addAccountFormVisible } = storeToRefs(accountManagement)

const clearState = () => {
  addAccountForm.value.checkedInfo = false
  addAccountForm.value.username = ''
  addAccountForm.value.vipType = ''
}

const addAccount = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  addAccountForm.value.addPending = true

  let response: _response | 'failed'

  try {
    response = await doAddAccount({
      cookie: addAccountForm.value.cookie
    })
  } catch (error) {
    clearState()
    response = 'failed'
  }

  addAccountForm.value.addPending = false

  if (response.toString() === 'failed') return

  accountManagement.closeAddDialog()
  await accountManagement.getAccounts()
  ElMessage.success('添加成功')
}

const addAccountFormRule = {
  cookie: [{ required: true, message: '请输入账户Cookie', trigger: 'blur' }]
}

const vipTypeMap = new Map([
  [0, '普通用户'],
  [1, '普通会员'],
  [2, '超级会员']
])

const getAccountInfo = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  addAccountForm.value.checkPending = true

  const response =
    (await doGetAccountInfo({
      cookie: addAccountForm.value.cookie
    })) ?? 'failed'

  addAccountForm.value.checkPending = false

  if (response.toString() === 'failed') return

  const { data } = response as _response

  addAccountForm.value.checkedInfo = true
  addAccountForm.value.username = data.baidu_name
  addAccountForm.value.vipType = vipTypeMap.get(data.vip_type) ?? '普通用户'
}
</script>

<style lang="scss" scoped></style>
