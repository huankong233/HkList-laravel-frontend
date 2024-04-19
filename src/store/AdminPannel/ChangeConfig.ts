import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreDefinition } from 'pinia'

export const useChangeConfigStore: StoreDefinition = defineStore('ChangeConfig', () => {
  const changeConfigForm = ref({
    version: '',
    frontEndVersion: '',
    userAgent: '',
    sleep: 1,
    maxOnce: 20,
    announceSwitch: false,
    announce: '',
    cookie: '',
    ssl: false,
    prefix: '/admin',
    debug: false,
    password: '',
    passwordSwitch: false,
    getPending: false,
    changePending: false
  })

  const changeConfigFormRef = ref<FormInstance | null>(null)

  return {
    changeConfigForm,
    changeConfigFormRef
  }
})
