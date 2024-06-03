<template>
  <el-dialog title="添加IP" width="60%" v-model="isAddIp" :before-close="close">
    <el-form
      ref="addIpFormRef"
      :model="addIpForm"
      :rules="addIpFormRule"
      label-width="auto"
      v-loading="pending"
    >
      <el-form-item label="IP" prop="ip">
        <el-input v-model="addIpForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="模式" prop="mode">
        <el-select v-model="addIpForm.mode">
          <el-option
            v-for="(item, index) in ['黑名单', '白名单']"
            :key="index"
            :label="item"
            :value="index"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="info" @click="cancel()">取消</el-button>
      <el-button type="primary" @click="addIp(addIpFormRef)">添加</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as IpApi from '@/apis/admin/ip.js'
import { isValidIp } from '@/utils/ip.js'
// import { registerKeyDown } from '@/utils/registerkeyDown.js'
import type { RuleItem } from 'async-validator'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits(['getIps'])
const isAddIp = defineModel()

const pending = ref(false)

const validateIP: RuleItem['validator'] = (rule, value: string, callback) => {
  if (!value) return callback(new Error('请输入IP地址'))

  if (!isValidIp(value)) {
    callback(new Error('请输入有效的IP地址'))
  } else {
    callback()
  }
}

const addIpForm = ref<IpApi.addIp>({
  ip: '',
  mode: 0
})
const addIpFormRef = ref<FormInstance | null>(null)
const addIpFormRule: FormRules = {
  ip: [{ validator: validateIP, message: '请输入IP', trigger: 'blur' }]
}

const addIp = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  try {
    pending.value = true
    await IpApi.addIp(addIpForm.value)
    ElMessage.success('添加成功')
  } finally {
    pending.value = false
  }
}

const close = (done: (cancel?: boolean) => {}) => {
  emit('getIps')
  done()
}

const cancel = () => {
  isAddIp.value = false
  emit('getIps')
}

// registerKeyDown('Enter', () => addIp(addIpFormRef.value))
</script>

<style lang="scss" scoped></style>
