import * as ParseApi from '@/apis/user/parse.js'
import { ElMessage, type FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileListStore = defineStore('fileListStore', () => {
  const pending = ref(false)

  const getFileListForm = ref<ParseApi.getFileList>({
    shorturl: '',
    url: '',
    pwd: '',
    dir: '/'
  })
  const getFileListFormRef = ref(null)

  // 根据路径生成上一个路径的地址
  const getPreviousPath = () => {
    const newArr = getFileListForm.value.dir.split('/')
    newArr.pop()
    const newPath = newArr.join('/')
    return newPath === '' ? '/' : newPath
  }

  const getFileList = async () => {
    if (!getFileListFormRef.value || !(await (getFileListFormRef.value as FormInstance).validate()))
      return

    try {
      selectedRows.value = []
      pending.value = true
      const res = await ParseApi.getFileList(getFileListForm.value)
      fileList.value = res.data
      if (getFileListForm.value.dir !== '/') {
        fileList.value.list.unshift({
          category: -1,
          fs_id: 0,
          isdir: 1,
          local_ctime: 0,
          local_mtime: 0,
          server_ctime: 0,
          server_mtime: 0,
          size: 0,
          md5: '',
          path: getPreviousPath(),
          server_filename: '..',
          dlink: ''
        })
      }
      ElMessage.success('获取文件列表成功')
    } finally {
      pending.value = false
    }
  }

  const fileList = ref<ParseApi.fileList>({
    uk: 0,
    shareid: 0,
    randsk: '',
    list: []
  })

  const selectedRows = ref<ParseApi.file[]>([])

  const downloadLinks = ref<ParseApi.downloadLinks>([])

  const downloadFiles = async (fs_id?: number, path?: string) => {
    const fs_ids = fs_id ? [fs_id] : selectedRows.value.map((row) => row.fs_id)
    const path_list = path ? [path] : selectedRows.value.map((row) => row.path)

    try {
      pending.value = true
      const res = await ParseApi.downloadFiles({
        uk: fileList.value.uk,
        shareid: fileList.value.shareid,
        randsk: fileList.value.randsk,
        fs_ids,
        path_list,
        url: getFileListForm.value.url
      })
      downloadLinks.value = res.data
      ElMessage.success('解析成功')
    } finally {
      pending.value = false
    }
  }

  return {
    pending,
    fileList,
    getFileList,
    getFileListForm,
    getFileListFormRef,
    selectedRows,
    downloadFiles,
    downloadLinks
  }
})
