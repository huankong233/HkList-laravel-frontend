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
    url: '',
    password: '',
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

  interface file {
    category: string
    fs_id: string
    isdir: string
    local_ctime: string
    local_mtime: string
    md5: string
    path: string
    server_ctime: string
    server_mtime: string
    size: string
  }

  const list = ref<file[]>([])

  const selectedRows = ref<file[]>([])

  const fileListTableRef = ref<TableInstance | null>(null)

  const dlinkList = ref([])

  const downloadDialogVisible = ref(false)

  const selectDownloadFiles = ref<{ dlink: string; server_filename: string }[]>([])

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
