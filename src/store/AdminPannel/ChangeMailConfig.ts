import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChangeMailConfigStore = defineStore('ChangeMailConfig', () => {
  const changeMailConfigForm = ref({
    mailSwitch: false,
    mailTo: '',
    mailHost: '',
    mailPort: '',
    mailUsername: '',
    mailPassword: '',
    mailFromAddress: '',
    mailFromName: '',

    pending: false
  })

  const changeMailConfigFormRef = ref<FormInstance | null>(null)

  return {
    changeMailConfigForm,
    changeMailConfigFormRef
  }
})
