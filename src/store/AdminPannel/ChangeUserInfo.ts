import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreDefinition } from 'pinia'

export const useChangeUserInfoStore: StoreDefinition = defineStore('ChangeUserInfo', () => {
  const changeUserInfoForm = ref({
    nowPassword: '',
    newPassword: '',
    confirmPassword: '',
    newUsername: '',
    pending: false
  })

  const changeUserInfoFormRef = ref<FormInstance | null>(null)

  return { changeUserInfoForm, changeUserInfoFormRef }
})
