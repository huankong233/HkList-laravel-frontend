import { loadAria2Config } from '@/utils/env.js'
import type { FormInstance, TableInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserPannelStore = defineStore('UserPannel', () => {
  const config = ref({
    announce: '',
    announceSwitch: false,
    debug: false,
    haveAccount: false,
    userAgent: '',
    pending: false
  })

  const ishttps = ref('https:' === document.location.protocol)

  const getFileListForm = ref({
    url: 'https://pan.baidu.com/s/1AJmJCw7VSm2qqRYrW-RFEw',
    password: 'jcb9',
    dir: '/',
    uk: 0,
    shareid: 0,
    randsk: 0,
    sign: '',
    timestamp: 0,
    bd_user_id: null,
    pending: false
  })

  const getFileListFormRef = ref<FormInstance | null>(null)

  const list = ref([])

  const selectedRows = ref([])

  const fileListTableRef = ref<TableInstance | null>(null)

  const dlinkList = ref([])

  const downloadDialogVisible = ref(false)

  const selectDownloadFiles = ref([])

  const aria2ConfigDialogVisible = ref(false)

  const aria2ConfigForm = ref(loadAria2Config())

  const aria2ConfigFormRef = ref<FormInstance | null>(null)

  return {
    config,
    ishttps,
    getFileListForm,
    getFileListFormRef,
    list,
    selectedRows,
    fileListTableRef,
    dlinkList,
    downloadDialogVisible,
    aria2ConfigForm,
    aria2ConfigDialogVisible,
    selectDownloadFiles,
    aria2ConfigFormRef
  }
})
