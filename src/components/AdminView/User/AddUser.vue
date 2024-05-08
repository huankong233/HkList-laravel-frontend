<template>
  <el-dialog title="添加用户" width="60%" v-model="isAddUser" :before-close="close">
    <el-form
      ref="addUserFormRef"
      :model="addUserForm"
      :rules="addUserFormRule"
      label-width="auto"
      v-loading="pending"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addUserForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="role">
        <el-option v-for="item in ['user', 'admin']" :key="item" :label="item" :value="item" />
      </el-form-item>
      <el-form-item label="用户组ID" prop="group_id">
        <el-input v-model="addUserForm.group_id"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="addUser(addUserFormRef)"> 添加 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as UserApi from '@/apis/admin/user.js'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits(['getUsers'])
const isAddUser = defineModel()

const pending = ref(false)

const addUserForm = ref<UserApi.addUser>({
  username: '',
  password: '',
  role: 'user',
  group_id: undefined
})
const addUserFormRef = ref<FormInstance | null>(null)
const addUserFormRule = {
  username: [{ required: true, message: '请输入账户用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入账户密码', trigger: 'blur' }]
}

const addUser = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await UserApi.addUser(addUserForm.value)
    ElMessage.success('添加成功')
  } finally {
    pending.value = false
  }
}

const close = (done: (cancel?: boolean) => {}) => {
  emit('getUsers')
  done()
}

const cancel = () => {
  isAddUser.value = false
  emit('getUsers')
}
</script>

<style lang="scss" scoped></style>
