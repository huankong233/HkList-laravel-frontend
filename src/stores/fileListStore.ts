import * as ParseApi from '@/apis/user/parse.js'
// import { AxiosError } from 'axios'
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

  const vcode = ref({
    hit_captcha: false,
    vcode_id: 0,
    vcode_img: '',
    vcode_input: ''
  })

  const selectedRows = ref<ParseApi.file[]>([])

  const downloadLinks = ref<ParseApi.downloadLinks>([])

  const downloadFiles = async (fs_id?: number, path?: string) => {
    const fs_ids = fs_id ? [fs_id] : selectedRows.value.map((row) => row.fs_id)
    const path_list = path ? [path] : selectedRows.value.map((row) => row.path)
    // let isNow = false

    try {
      pending.value = true
      const req: ParseApi.downloadFiles = {
        uk: fileList.value.uk,
        shareid: fileList.value.shareid,
        randsk: fileList.value.randsk,
        fs_ids,
        path_list
      }
      // if (vcode.value.hit_captcha) {
      //   req.vcode_id = vcode.value.vcode_id
      //   req.vcode_input = vcode.value.vcode_input
      // }
      const res = await ParseApi.downloadFiles(req)
      downloadLinks.value = res.data
      ElMessage.success('解析成功')
    } catch (error) {
      // if (!(error instanceof AxiosError)) {
      //   const errorData = error as { message: string; data: ParseApi.vcode }
      //   if (errorData.message === '触发验证码') {
      //     isNow = true
      //     vcode.value.hit_captcha = true
      //     vcode.value.vcode_id = errorData.data.vcode_id
      //     vcode.value.vcode_img = errorData.data.vcode_img
      //   }
      // }
    } finally {
      // pending.value = false
      // && !isNow
      // if (vcode.value.hit_captcha) {
      //   vcode.value.hit_captcha = false
      //   vcode.value.vcode_id = 0
      //   vcode.value.vcode_img = ''
      //   vcode.value.vcode_input = ''
      // }
    }
  }

  return {
    pending,
    vcode,
    fileList,
    getFileList,
    getFileListForm,
    getFileListFormRef,
    selectedRows,
    downloadFiles,
    downloadLinks
  }
})
