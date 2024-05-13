import { loadAria2Config, setAria2Config } from '@/utils/env.js'
import { ElMessage, type FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAria2Store = defineStore('aria2Store', () => {
  const aria2ConfigDialogVisible = ref(false)
  const aria2ConfigForm = ref(loadAria2Config())
  const aria2ConfigFormRef = ref<FormInstance | null>(null)

  const saveAria2Config = async () => {
    if (!aria2ConfigFormRef.value || !(await aria2ConfigFormRef.value.validate())) return

    setAria2Config(aria2ConfigForm.value)
    ElMessage.success('保存成功')
    aria2ConfigDialogVisible.value = false
  }

  return {
    aria2ConfigDialogVisible,
    aria2ConfigForm,
    aria2ConfigFormRef,
    saveAria2Config
  }
})
