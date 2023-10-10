import { getPrefix } from '@/utils/env'
import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginPannelStore = defineStore('LoginPannel', () => {
  const loginForm = ref({
    prefix: getPrefix(),
    username: '',
    password: '',
    pending: false
  })

  const loginFormRef = ref<FormInstance | null>(null)

  return { loginForm, loginFormRef }
})
