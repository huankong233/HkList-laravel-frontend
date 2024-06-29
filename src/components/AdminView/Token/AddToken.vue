<template>
  <el-dialog title="添加卡密" width="60%" v-model="isAddToken" :before-close="close">
    <el-form
      ref="addTokenFormRef"
      :model="addTokenForm"
      :rules="addTokenFormRule"
      label-width="auto"
      v-loading="pending"
    >
      <el-form-item label="创建方式" prop="type">
        <el-select v-model="addTokenForm.type">
          <el-option v-for="item in ['single', 'random']" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="可用次数" prop="count">
        <el-input-number v-model="addTokenForm.count"></el-input-number>
      </el-form-item>
      <el-form-item label="可用天数" prop="day">
        <el-input-number v-model="addTokenForm.day"></el-input-number>
      </el-form-item>
      <el-form-item label="可下大小(GB)" prop="size">
        <el-input-number v-model="addTokenForm.size"></el-input-number>
      </el-form-item>
      <el-form-item label="卡密名称" prop="name" v-if="addTokenForm.type === 'single'">
        <el-input v-model="addTokenForm.name"></el-input>
      </el-form-item>
      <el-form-item label="卡密个数" prop="token_count" v-else>
        <el-input-number v-model="addTokenForm.token_count"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="addToken(addTokenFormRef)">添加</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as TokenApi from '@/apis/admin/token.js'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits(['getTokens'])
const isAddToken = defineModel()

const pending = ref(false)
const addTokenForm = ref<TokenApi.addToken>({
  type: 'single',
  name: '',
  count: 0,
  size: 0,
  day: 0
})
const addTokenFormRef = ref<FormInstance | null>(null)
const addTokenFormRule: FormRules = {
  name: [{ required: true, message: '请输入卡密名称', trigger: 'blur' }],
  token_count: [{ required: true, message: '请输入卡密个数', trigger: 'blur' }],
  day: [{ required: true, message: '请输入卡密天数', trigger: 'blur' }],
  count: [{ required: true, message: '请输入可下载次数', trigger: 'blur' }],
  size: [{ required: true, message: '请输入可下载大小', trigger: 'blur' }]
}

const addToken = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    if (addTokenForm.value.type === 'single') {
      await TokenApi.addTokenSingle({
        type: 'single',
        name: addTokenForm.value.name,
        count: addTokenForm.value.count,
        size: addTokenForm.value.size,
        day: addTokenForm.value.day
      })
    } else {
      await TokenApi.addTokenRandom({
        type: 'random',
        token_count: addTokenForm.value.token_count,
        count: addTokenForm.value.count,
        size: addTokenForm.value.size,
        day: addTokenForm.value.day
      })
    }
    ElMessage.success('添加成功')
  } finally {
    pending.value = false
  }
}

const close = (done: (cancel?: boolean) => {}) => {
  emit('getTokens')
  done()
}

const cancel = () => {
  isAddToken.value = false
  emit('getTokens')
}
</script>

<style lang="scss" scoped></style>
