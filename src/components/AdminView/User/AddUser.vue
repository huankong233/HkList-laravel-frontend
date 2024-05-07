<template>
  <el-dialog title="添加用户" width="60%" v-model="isAddUser">
    <el-form
      ref="addAccountFormRef"
      :model="addAccountForm"
      :rules="addAccountFormRule"
      label-width="auto"
      v-loading="pending"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addAccountForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addAccountForm.password"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="role">
        <el-select v-model="addAccountForm.role">
          <el-option key="user" label="user" value="user"></el-option>
          <el-option key="admin" label="admin" value="admin"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户组ID" prop="group_id">
        <el-input v-model="addAccountForm.group_id"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="isAddUser = false">取消</el-button>
      <el-button type="primary" @click="addAccount(addAccountFormRef)"> 添加 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { sleep } from '@/utils/sleep.js'
import type { FormInstance } from 'element-plus'
import * as UserApi from '@/apis/admin/user.js'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits(['getAccount'])
const isAddUser = defineModel()

const pending = ref(false)

const addAccountForm = ref<UserApi.addUser>({
  username: '',
  password: '',
  role: 'user',
  group_id: undefined
})
const addAccountFormRef = ref<FormInstance | null>(null)
const addAccountFormRule = {
  username: [{ required: true, message: '请输入账户用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入账户密码', trigger: 'blur' }]
}

const addAccount = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await UserApi.addUser(addAccountForm.value)
    await sleep(1000)
    ElMessage.success('添加成功')
    addAccountForm.value = {
      username: '',
      password: '',
      role: 'user',
      group_id: undefined
    }
    emit('getAccount')
  } finally {
    pending.value = false
  }
}
</script>

<style lang="scss" scoped></style>
