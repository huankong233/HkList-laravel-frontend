import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChangeConfigStore = defineStore('ChangeConfig', () => {
  const changeConfigForm = ref({
    version: '',
    userAgent: '',
    sleep: 1,
    maxOnce: 20,
    announceSwitch: false,
    announce: '',
    cookie: '',
    ssl: false,
    prefix: '/admin',
    debug: false,
    getPending: false,
    changePending: false
  })

  const changeConfigFormRef = ref<FormInstance | null>(null)

  return {
    changeConfigForm,
    changeConfigFormRef
  }
})
