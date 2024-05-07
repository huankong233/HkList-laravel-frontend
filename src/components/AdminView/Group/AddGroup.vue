<template>
  <el-dialog title="添加用户组" width="60%" v-model="isAddGroup" :before-close="close">
    <el-form
      ref="addGroupFormRef"
      :model="addGroupForm"
      :rules="addGroupFormRule"
      label-width="auto"
      v-loading="pending"
    >
      <el-form-item label="组名" prop="name">
        <el-input v-model="addGroupForm.name"></el-input>
      </el-form-item>
      <el-form-item label="可解析个数" prop="count">
        <el-input-number v-model="addGroupForm.count"></el-input-number>
      </el-form-item>
      <el-form-item label="可解析大小" prop="size">
        <el-input-number v-model="addGroupForm.size"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="addGroup(addGroupFormRef)"> 添加 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import * as GroupApi from '@/apis/admin/group.js'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits(['getGroups'])
const isAddGroup = defineModel()

const pending = ref(false)

const addGroupForm = ref<GroupApi.addGroup>({
  name: '',
  count: 0,
  size: 0
})
const addGroupFormRef = ref<FormInstance | null>(null)
const addGroupFormRule = {
  name: [{ required: true, message: '请输入组名', trigger: 'blur' }],
  count: [{ required: true, message: '请输入可解析个数', trigger: 'blur' }],
  size: [{ required: true, message: '请输入可解析大小', trigger: 'blur' }]
}

const addGroup = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await GroupApi.addGroup(addGroupForm.value)
    ElMessage.success('添加成功')
  } finally {
    pending.value = false
  }
}

const close = (done: (cancel?: boolean) => {}) => {
  emit('getGroups')
  done()
}

const cancel = () => {
  isAddGroup.value = false
  emit('getGroups')
}
</script>

<style lang="scss" scoped></style>
