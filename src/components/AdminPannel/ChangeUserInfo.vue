<template>
  <el-form
    ref="changeUserInfoFormRef"
    v-bind:model="changeUserInfoForm"
    v-bind:rules="changeUserInfoFormRule"
    label-width="auto"
  >
    <el-form-item label="新的用户名(为空就是不改)" prop="newUsername">
      <el-input v-model="changeUserInfoForm.newUsername"></el-input>
    </el-form-item>
    <el-form-item label="旧密码" prop="nowPassword">
      <el-input v-model="changeUserInfoForm.nowPassword"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="changeUserInfoForm.newPassword"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="confirmPassword">
      <el-input v-model="changeUserInfoForm.confirmPassword"></el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button
        type="primary"
        v-on:click="changeUserInfo(changeUserInfoFormRef)"
        v-bind:disabled="changeUserInfoForm.pending"
        v-bind:loading="changeUserInfoForm.pending"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'

import { useChangeUserInfoStore } from '@/store/ChangeUserInfo.js'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { doChangeUserInfo } from '@/apis/admin.js'
import { setLoginState } from '@/utils/env.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const changeUserInfoStore = useChangeUserInfoStore()
const { changeUserInfoForm, changeUserInfoFormRef } = storeToRefs(changeUserInfoStore)

const changeUserInfoFormRule = {
  nowPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }]
}

const changeUserInfo = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (await formEl.validate(() => {})) {
    if (changeUserInfoForm.value.newPassword !== changeUserInfoForm.value.confirmPassword) {
      ElMessage.error('两次密码不一致')
      return
    }

    changeUserInfoForm.value.pending = true
    const response =
      (await doChangeUserInfo({
        ...changeUserInfoForm.value,
        newUsername: changeUserInfoForm.value.newUsername ?? ''
      })) ?? 'failed'
    changeUserInfoForm.value.pending = false

    if (response.toString() === 'failed') return

    changeUserInfoForm.value = {
      newUsername: '',
      nowPassword: '',
      newPassword: '',
      confirmPassword: '',
      pending: false
    }
    ElMessage.success('修改成功')
    setLoginState('0')
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped></style>
