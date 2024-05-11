import * as ParseApi from '@/apis/user/parse.js'
import { ElMessage, type FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileListStore = defineStore('fileListStore', () => {
  const pending = ref(false)

  const getFileListForm = ref<ParseApi.getFileList>({
    surl: '',
    url: '',
    pwd: '',
    dir: '/',
    password: ''
  })
  const getFileListFormRef = ref(null)

  // 根据路径生成上一个路径的地址
  const getPreviousPath = () => {
    const newArr = getFileListForm.value.dir.split('/')
    newArr.pop()
    const newPath = newArr.join('/')
    return newPath === '' ? '/' : newPath
  }

  const signData = ref({
    sign: '',
    timestamp: 0
  })

  const getSign = async () => {
    try {
      pending.value = true
      const res = await ParseApi.getSign({
        surl: getFileListForm.value.surl,
        uk: fileList.value.uk,
        shareid: fileList.value.shareid,
        password: getFileListForm.value.password
      })
      signData.value.sign = res.data.sign
      signData.value.timestamp = res.data.timestamp
      ElMessage.success('获取签名成功')
    } finally {
      pending.value = false
    }
  }

  // 检查签名是否过期
  const checkSign = async () => {
    if (Date.now() / 1000 - signData.value.timestamp > 250) {
      ElMessage.info('获取签名中')
      await getSign()
    } else {
      ElMessage.success('签名未过期,无需更新')
    }
  }

  const getFileList = async () => {
    if (!getFileListFormRef.value || !(await (getFileListFormRef.value as FormInstance).validate()))
      return

    if (getFileListForm.value.surl === '') return ElMessage.error('获取链接surl失败')

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
      await checkSign()
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

  const getDownloadLinks = async (fs_id?: number) => {
    const fs_ids = fs_id
      ? [fs_id]
      : selectedRows.value.filter((file) => file.isdir !== 1).map((row) => row.fs_id)

    if (fs_ids.length !== selectedRows.value.length) ElMessage.error('文件夹不会被解析!')

    await checkSign()

    try {
      pending.value = true
      const res = await ParseApi.getDownloadLinks({
        uk: fileList.value.uk,
        shareid: fileList.value.shareid,
        randsk: fileList.value.randsk,
        fs_ids,
        sign: signData.value.sign,
        timestamp: signData.value.timestamp,
        password: getFileListForm.value.password
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
    downloadLinks,
    getDownloadLinks
  }
})
