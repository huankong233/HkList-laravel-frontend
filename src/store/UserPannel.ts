import { setLoginState } from './../utils/env'
import { loadAria2Config } from '@/utils/env.js'
import type { FormInstance, TableInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doGetConfig, doGetFileList, doGetSign, doDownloadFiles } from '@/apis/user'
import type { _response } from '@/utils/request.js'
import { ElMessage } from 'element-plus'

export interface file {
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

export const useUserPannelStore = defineStore('UserPannel', () => {
  const clientConfig = ref({
    announce: '',
    announceSwitch: false,
    debug: false,
    haveAccount: false,
    havePassword: false,
    haveLogin: false,
    userAgent: '',
    ishttps: document.location.protocol === 'https',
    pending: false
  })

  const getConfig = async () => {
    clientConfig.value.pending = true
    const response = (await doGetConfig()) ?? 'failed'
    clientConfig.value.pending = false

    if (response.toString() === 'failed') return

    Object.assign(clientConfig.value, {
      ...(response as _response).data,
      announce: response.data.announce.replace(/\[NextLine\]/g, '<br>')
    })

    setLoginState((response as _response).data.haveLogin ? '1' : '0')
  }

  const getFileListForm = ref({
    url: '',
    pwd: '',
    password: '',
    dir: '/',
    bd_user_id: null,
    pending: false
  })

  const getFileListFormRef = ref<FormInstance | null>(null)

  const filelist = ref<file[]>([])

  const requestParams = ref({
    // getFileList
    randsk: '',
    shareid: 0,
    uk: 0,
    // getFileSign
    sign: '',
    timestamp: 0
  })

  const selectedRows = ref<file[]>([])

  const fileListTableRef = ref<TableInstance | null>(null)

  const getDir = async (path: string, server_mtime: string) => {
    getFileListForm.value.dir = path
    await getFileList(server_mtime)
  }

  // 根据路径生成上一个路径的地址
  const getPreviousPath = () => {
    const newArr = getFileListForm.value.dir.split('/')
    newArr.pop()
    const newPath = newArr.join('/')
    return newPath === '' ? '/' : newPath
  }

  const getFileList = async (server_mtime = '0', refresh = false) => {
    const fileListResponse =
      (await doGetFileList({
        url: getFileListForm.value.url,
        pwd: getFileListForm.value.pwd,
        dir: getFileListForm.value.dir,
        password: getFileListForm.value.password
      })) ?? 'failed'

    if (fileListResponse.toString() === 'failed') return

    const { message, data } = fileListResponse as _response
    ElMessage.success(message)

    Object.assign(requestParams.value, {
      randsk: data.randsk,
      shareid: data.shareid,
      uk: data.uk
    })

    filelist.value = data.list

    if (
      getFileListForm.value.dir !== null &&
      getFileListForm.value.dir !== '' &&
      getFileListForm.value.dir !== '/'
    ) {
      filelist.value = [
        {
          isdir: '1',
          path: getPreviousPath(),
          server_filename: '..',
          size: '0',
          server_mtime: refresh ? filelist.value[0].server_mtime : server_mtime
        },
        ...data.list
      ]
    } else {
      filelist.value = data.list
    }

    return 'success'
  }

  const getFileSign = async () => {
    const response =
      (await doGetSign({
        uk: requestParams.value.uk,
        shareid: requestParams.value.shareid,
        password: getFileListForm.value.password
      })) ?? 'failed'

    if (response.toString() === 'failed') return

    const { message, data } = response as _response

    ElMessage.success(message)
    Object.assign(requestParams.value, data)
  }

  const downloadFile = async (fs_id: string[] | string) => {
    const response =
      (await doDownloadFiles({
        // 如果fs_id是数组则表示批量下载
        // 否则就是单个下载手动修改成数组
        fs_ids: Array.isArray(fs_id) ? fs_id : [fs_id],
        ...requestParams.value,
        password: getFileListForm.value.password,
        bd_user_id: getFileListForm.value.bd_user_id
      }).catch(async error => {
        const { message } = error
        if (message.includes('当前签名已过期')) {
          ElMessage.error(message)
          ElMessage.info('自动重新获取中...')
          await freshFileList(getFileListFormRef.value)
        } else if (message.includes('您没有权限指定下载的用户')) {
          setLoginState('0')
          ElMessage.error('登陆已过期,请重新登陆')
          location.reload()
        }
      })) ?? 'failed'

    if (!response || response === 'failed') return

    const { data } = response
    ElMessage.success('解析成功')

    dlinkList.value = data
    downloadDialogVisible.value = true
  }

  const freshFileList = async (formEl: FormInstance | null) => {
    if (!formEl) return
    if (!(await formEl.validate(() => {}))) return

    getFileListForm.value.pending = true
    await getFileList('0', true)
    await getFileSign()
    getFileListForm.value.pending = false
  }

  const downloadFiles = async () => {
    getFileListForm.value.pending = true
    let bad = false
    selectedRows.value = selectedRows.value.filter(item => {
      if (bad) return false
      const bool = item.isdir == '1'
      if (bool) {
        bad = true
        ElMessage.error('暂不支持下载文件夹')
        fileListTableRef.value?.clearSelection()
      }
      return !bool
    })

    if (bad) {
      getFileListForm.value.pending = false
      return
    }

    // 收集fids
    const fs_ids: string[] = selectedRows.value.map(item => item.fs_id)
    await downloadFile(fs_ids)
    getFileListForm.value.pending = false
  }

  const dlinkList = ref([])
  const downloadDialogVisible = ref(false)
  const selectDownloadFiles = ref<{ dlink: string; server_filename: string }[]>([])
  const aria2ConfigDialogVisible = ref(false)
  const aria2ConfigForm = ref(loadAria2Config())
  const aria2ConfigFormRef = ref<FormInstance | null>(null)

  const saveAria2Config = async (formEl: FormInstance | null) => {
    if (!formEl) return
    if (!(await formEl.validate(() => {}))) return
    localStorage.setItem('aria2_config', JSON.stringify(aria2ConfigForm.value))
    ElMessage.success('保存成功')
    aria2ConfigDialogVisible.value = false
  }

  return {
    getConfig,
    getDir,
    getFileList,
    getFileSign,
    freshFileList,
    downloadFile,
    downloadFiles,
    clientConfig,
    getFileListForm,
    getFileListFormRef,
    filelist,
    requestParams,
    selectedRows,
    fileListTableRef,
    dlinkList,
    downloadDialogVisible,
    selectDownloadFiles,
    aria2ConfigForm,
    aria2ConfigDialogVisible,
    aria2ConfigFormRef,
    saveAria2Config
  }
})
