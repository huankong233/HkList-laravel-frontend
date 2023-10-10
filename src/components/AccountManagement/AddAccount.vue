<template>
  <el-dialog v-model="addAccountFormVisible" title="添加代理账号" width="60%">
    <el-form
      ref="addAccountFormRef"
      v-bind:model="addAccountForm"
      v-bind:rules="addAccountFormRule"
      label-width="200px"
    >
      <el-form-item label="账户Cookie" prop="cookie">
        <el-input type="textarea" v-model="addAccountForm.cookie" rows="5"></el-input>
      </el-form-item>
      <el-form-item label="账号名称" prop="username">
        <el-input v-model="addAccountForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="账号等级" prop="vipType">
        <el-input v-model="addAccountForm.vipType" disabled></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="accountManagement.closeAddDialog()">取消</el-button>
        <el-button
          type="primary"
          @click="getAccountInfo"
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
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'

import { storeToRefs } from 'pinia'
import { useAccountManagementStore } from '@/store/AccountManagement.js'
import { doAddAccount, doGetAccountInfo } from '@/apis/admin.js'
import { ElMessage } from 'element-plus'

const accountManagement = useAccountManagementStore()
const { addAccountForm, addAccountFormRef, addAccountFormVisible } = storeToRefs(accountManagement)

const addAccount = async (formEl: FormInstance) => {
  if (!formEl) return
  if (await formEl.validate(() => {})) {
    addAccountForm.value.addPending = true

    const response =
      (await doAddAccount({
        cookie: addAccountForm.value.cookie.trim()
      }).catch(() => {
        addAccountForm.value.checkedInfo = false
        addAccountForm.value.username = ''
        addAccountForm.value.vipType = ''
      })) ?? 'failed'

    addAccountForm.value.addPending = false

    if (response !== 'failed') {
      accountManagement.closeAddDialog()
      ElMessage.success('添加成功')
      await accountManagement.getAccounts()
    }
  }
}

const addAccountFormRule = {
  cookie: [{ required: true, message: '请输入账户Cookie', trigger: 'blur' }]
}

const vipTypeMap = new Map([
  [0, '普通用户'],
  [1, '普通会员'],
  [2, '超级会员']
])

const getAccountInfo = async () => {
  if (!addAccountFormRef.value) return
  if (await addAccountFormRef.value.validate(() => {})) {
    addAccountForm.value.checkPending = true
    const response =
      (await doGetAccountInfo({
        cookie: addAccountForm.value.cookie.trim()
      })) ?? 'failed'

    addAccountForm.value.checkPending = false

    if (response !== 'failed') {
      const { data } = response
      addAccountForm.value.checkedInfo = true
      addAccountForm.value.username = data.baidu_name
      addAccountForm.value.vipType = vipTypeMap.get(data.vip_type)
    }
  }
}
</script>

<style lang="scss" scoped></style>
