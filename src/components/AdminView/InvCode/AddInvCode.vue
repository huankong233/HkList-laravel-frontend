<template>
  <el-dialog title="添加邀请码" width="60%" v-model="isAddInvCode" :before-close="close">
    <el-form
      ref="addInvCodeFormRef"
      :model="addInvCodeForm"
      :rules="addInvCodeFormRule"
      label-width="auto"
      v-loading="pending"
    >
      <el-form-item label="创建方式" prop="type">
        <el-select v-model="addInvCodeForm.type">
          <el-option v-for="item in ['single', 'random']" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="可用次数" prop="can_count">
        <el-input-number v-model="addInvCodeForm.can_count"></el-input-number>
      </el-form-item>
      <el-form-item label="用户组ID" prop="group_id">
        <el-input-number v-model="addInvCodeForm.group_id"></el-input-number>
      </el-form-item>
      <el-form-item label="邀请码名称" prop="name" v-if="addInvCodeForm.type === 'single'">
        <el-input v-model="addInvCodeForm.name"></el-input>
      </el-form-item>
      <el-form-item label="邀请码个数" prop="count" v-else>
        <el-input-number v-model="addInvCodeForm.count"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="addInvCode(addInvCodeFormRef)">添加</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as InvCodeApi from '@/apis/admin/invCode.js'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits(['getInvCodes'])
const isAddInvCode = defineModel()

const pending = ref(false)
const addInvCodeForm = ref<InvCodeApi.addInvCode>({
  type: 'single',
  group_id: 2,
  name: '',
  can_count: 10
})
const addInvCodeFormRef = ref<FormInstance | null>(null)
const addInvCodeFormRule: FormRules = {
  group_id: [{ required: true, message: '请输入邀请码用户组ID', trigger: 'blur' }],
  name: [{ required: true, message: '请输入邀请码名称', trigger: 'blur' }],
  can_count: [{ required: true, message: '请输入可注册次数', trigger: 'blur' }],
  count: [{ required: true, message: '请输入邀请码个数', trigger: 'blur' }]
}

const addInvCode = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    if (addInvCodeForm.value.type === 'single') {
      await InvCodeApi.addInvCodeSingle({
        type: 'single',
        name: addInvCodeForm.value.name,
        can_count: addInvCodeForm.value.can_count,
        group_id: addInvCodeForm.value.group_id
      })
    } else {
      await InvCodeApi.addInvCodeRandom({
        type: 'random',
        count: addInvCodeForm.value.count,
        can_count: addInvCodeForm.value.can_count,
        group_id: addInvCodeForm.value.group_id
      })
    }
    ElMessage.success('添加成功')
  } finally {
    pending.value = false
  }
}

const close = (done: (cancel?: boolean) => {}) => {
  emit('getInvCodes')
  done()
}

const cancel = () => {
  isAddInvCode.value = false
  emit('getInvCodes')
}
</script>

<style lang="scss" scoped></style>
