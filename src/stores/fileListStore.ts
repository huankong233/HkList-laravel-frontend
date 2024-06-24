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
  const getFileListFormRef = ref<FormInstance | null>(null)

  // 根据路径生成上一个路径的地址
  const getPreviousPath = () => {
    const newArr = getFileListForm.value.dir.split('/')
    newArr.pop()
    const newPath = newArr.join('/')
    return newPath === '' ? '/' : newPath
  }

  const getFileList = async () => {
    if (!getFileListFormRef.value || !(await getFileListFormRef.value.validate())) return

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
    }
  }

  const vcode = ref({
    hit_captcha: false,
    vcode_str: '',
    vcode_img: '',
    vcode_input: ''
  })

  const fileList = ref<ParseApi.fileList>({
    uk: 0,
    shareid: 0,
    randsk: '',
    list: []
  })

  const selectedRows = ref<ParseApi.file[]>([])

  const downloadLinks = ref<ParseApi.downloadLinks>([])

  const getDownloadLinks = async (fs_id?: number, returnValue = false) => {
    if (pending.value) {
      ElMessage.info('请勿重复点击~')
      return
    }

    const fs_ids = fs_id
      ? [fs_id]
      : selectedRows.value.filter((file) => file.isdir !== 1).map((row) => row.fs_id)

    if (fs_id === undefined && fs_ids.length !== selectedRows.value.length) {
      ElMessage.error('文件夹不会被解析!')
    }

    let res
    try {
      pending.value = true
      const req: ParseApi.getDownloadLinks = {
        uk: fileList.value.uk,
        shareid: fileList.value.shareid,
        randsk: fileList.value.randsk,
        fs_ids,
        password: getFileListForm.value.password,
        url: getFileListForm.value.url
      }

      if (vcode.value.hit_captcha) {
        req.vcode_str = vcode.value.vcode_str
        req.vcode_input = vcode.value.vcode_input
      }

      res = await ParseApi.getDownloadLinks(req)
      ElMessage.success('解析成功,下载链接请下滑')

      if (returnValue) {
        pending.value = false
        await getLimit()
        return res.data.map((link) => {
          return {
            ...link,
            index: 0
          }
        })
      } else {
        downloadLinks.value = res.data.map((link) => {
          return {
            ...link,
            index: 0
          }
        })
      }

      vcode.value = {
        hit_captcha: false,
        vcode_str: '',
        vcode_img: '',
        vcode_input: ''
      }
    } catch (error) {
      const { code, message } = error as { code?: number; message?: string }
      if (code && message && message.includes('验证码')) {
        const res = await ParseApi.getVcode()

        vcode.value = {
          hit_captcha: true,
          vcode_str: res.data.vcode,
          vcode_img: res.data.img,
          vcode_input: ''
        }
      }
    } finally {
      pending.value = false
      await getLimit()
    }
  }

  const limitForm = ref<ParseApi.limit>({
    group_name: '',
    count: 0,
    size: 0
  })

  const hitLimit = ref(false)

  const getLimit = async () => {
    try {
      pending.value = true
      const res = await ParseApi.getLimit()
      limitForm.value = res.data
      hitLimit.value = false
    } catch {
      hitLimit.value = true
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
    getDownloadLinks,
    limitForm,
    getLimit,
    hitLimit,

    vcode
  }
})
