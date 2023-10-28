<template>
  <!-- <announceDialog /> -->
  <!-- <aria2ConfigDialog />
  <downloadDialog />

  <getFileListForm />
  <showFileList /> -->123
</template>

<script lang="ts" setup>
// import aria2ConfigDialog from '@/components/UserPannel/aria2ConfigDialog.vue'
// import announceDialog from '@/components/UserPannel/announceDialog.vue'
// import downloadDialog from '@/components/UserPannel/downloadDialog.vue'

// import getFileListForm from '@/components/UserPannel/getFileListForm.vue'
// import showFileList from '@/components/UserPannel/showFileList.vue'

// import { onMounted } from 'vue'

// onMounted(() => {})

// import type { FormInstance, FormRules } from 'element-plus'
// import { getAppName } from '@/utils/env.js'
// import { storeToRefs } from 'pinia'
// import { useUserPannelStore } from '@/store/UserPannel.js'
// import { doGetConfig, doGetFileList, doGetSign } from '@/apis/user'
// import { getLoginState } from '@/utils/env.js'
// import { formatBytes, formatTimestamp } from '@/utils/format.js'
// import folder from '@/assets/image/folder.png'
// import unknownfile from '@/assets/image/unknownfile.png'
// import { ElMessage } from 'element-plus'
// import Clipboard from 'clipboard'
// import { doDownloadFiles } from '@/apis/user.js'
// import { useRoute } from 'vue-router'

// const userPannelStore = useUserPannelStore()
// const {
//   config,
//   ishttps,
//   getFileListForm,
//   getFileListFormRef,
//   list,
//   dlinkList,
//   selectedRows,
//   fileListTableRef,
//   downloadDialogVisible,
//   aria2ConfigForm,
//   aria2ConfigFormRef,
//   selectDownloadFiles,
//   aria2ConfigDialogVisible
// } = storeToRefs(userPannelStore)

// const route = useRoute()
// Object.assign(getFileListForm.value, route.query)

// async function getConfig() {
//   config.value.pending = true
//   const response = (await doGetConfig()) ?? 'failed'
//   config.value.pending = false

//   // @ts-ignore
//   if (response === 'failed') return

//   config.value = {
//     ...config.value,
//     ...response.data,
//     announce: response.data.announce.replaceAll('[NextLine]', '<br>')
//   }
// }

// onMounted(() => {
//   getConfig()
// })

// const getUrlId = (url: string) => {
//   const fullMatch = url.match(/s\/([a-zA-Z0-9_-]+)/)
//   const passwordMatch = url.match(/\?pwd=([a-zA-Z0-9_-]+)/)
//   if (fullMatch) {
//     return {
//       id: fullMatch[1],
//       password: passwordMatch ? passwordMatch[1] : null
//     }
//   }

//   return false
// }

// const urlValidator = (rule: any, value: string, callback: any) => {
//   if (value === '') {
//     return callback(new Error('请先输入需要解析的链接'))
//   }

//   if (getUrlId(value)) {
//     return callback()
//   } else {
//     return callback(new Error('请输入合法的链接'))
//   }
// }

// const getFileListFormRule: FormRules = {
//   url: [{ required: true, validator: urlValidator, trigger: 'blur' }]
// }

// const checkLink = () => {
//   list.value = []
//   getFileListForm.value.dir = '/'
//   selectedRows.value = []

//   const data = getUrlId(getFileListForm.value.url)
//   if (!data) return
//   if (data.id) getFileListForm.value.url = `https://pan.baidu.com/s/${data.id}`
//   if (data.password) {
//     getFileListForm.value.password = data.password
//     ElMessage.success('已自动填写密码')
//   }
// }

// const getFileListClickEvent = async (formEl: FormInstance | null) => {
//   if (!formEl) return
//   if (!(await formEl.validate(() => {}))) return

//   getFileListForm.value.pending = true

//   // 如果获取列表成功再获取签名
//   if (await getFileList()) await getFileSign()

//   getFileListForm.value.pending = false
// }

// // 根据路径生成上一个路径的地址
// const getPreviousPath = () => {
//   let newArr = getFileListForm.value.dir.split('/')
//   newArr.pop()
//   const newPath = newArr.join('/')
//   return newPath === '' ? '/' : newPath
// }

// const getFileList = async (server_mtime = '0', refresh = false) => {
//   const fileList =
//     (await doGetFileList({
//       url: getFileListForm.value.url,
//       password: getFileListForm.value.password,
//       dir: getFileListForm.value.dir
//     })) ?? 'failed'

//   // @ts-ignore
//   if (fileList === 'failed') return

//   let { message, data } = fileList
//   ElMessage.success(message)

//   Object.assign(getFileListForm.value, { randsk: data.randsk, uk: data.uk, shareid: data.shareid })
//   list.value = data.list

//   if (
//     getFileListForm.value.dir !== null &&
//     getFileListForm.value.dir !== '' &&
//     getFileListForm.value.dir !== '/'
//   ) {
//     list.value = [
//       {
//         isdir: '1',
//         path: getPreviousPath(),
//         server_filename: '..',
//         size: '0',
//         server_mtime: refresh ? list.value[0].server_mtime : server_mtime
//       },
//       ...data.list
//     ]
//   } else {
//     list.value = data.list
//   }

//   return 'success'
// }

// const getFileSign = async () => {
//   const response =
//     (await doGetSign({
//       uk: getFileListForm.value.uk,
//       shareid: getFileListForm.value.shareid
//     })) ?? 'failed'

//   // @ts-ignore
//   if (response === 'failed') return

//   const { message, data } = response
//   ElMessage.success(message)

//   Object.assign(getFileListForm.value, data)
// }

// const freshFileList = async (formEl: FormInstance | null) => {
//   if (!formEl) return
//   if (!(await formEl.validate(() => {}))) return

//   getFileListForm.value.pending = true
//   await getFileList('0', true)
//   await getFileSign()
//   getFileListForm.value.pending = false
// }

// const copy = (text: string, message: string) => {
//   const textarea = document.createElement('textarea')
//   textarea.value = text
//   document.body.appendChild(textarea)
//   new Clipboard(textarea, {
//     text: () => text
//   })
//   textarea.click()
//   document.body.removeChild(textarea)

//   if (message) {
//     ElMessage({
//       message: message,
//       type: 'success'
//     })
//   }
// }

// const copyLink = async (formEl: FormInstance | null) => {
//   if (!formEl) return
//   if (!(await formEl.validate(() => {}))) return

//   copy(
//     `${location.host}/?url=${getFileListForm.value.url}&password=${getFileListForm.value.password}&dir=${getFileListForm.value.dir}`,
//     '复制成功'
//   )
// }

// const clickRow = async (scope: any) => {
//   if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) return
//   getFileListForm.value.pending = true
//   if (scope.isdir === '1' || scope.isdir === 1) {
//     await getDir(scope.path, scope.server_mtime)
//   } else {
//     await downloadFile(scope.fs_id)
//   }
//   getFileListForm.value.pending = false
// }

// const dblclickRow = async (scope: any) => {
//   getFileListForm.value.pending = true
//   if (scope.isdir === '1' || scope.isdir === 1) {
//     await getDir(scope.path, scope.server_mtime)
//   } else {
//     await downloadFile(scope.fs_id)
//   }
//   getFileListForm.value.pending = false
// }

// const getDir = async (path: string, server_mtime: string) => {
//   getFileListForm.value.dir = path
//   await getFileList(server_mtime)
// }

// const downloadFile = async (fs_id: string[] | string) => {
//   const response =
//     (await doDownloadFiles({
//       // 如果fs_id是数组则表示批量下载
//       // 否则就是单个下载手动修改成数组
//       fs_ids: Array.isArray(fs_id) ? fs_id : [fs_id],
//       ...getFileListForm.value
//     }).catch(async error => {
//       const { message } = error
//       if (message.includes('当前签名已过期')) {
//         ElMessage.error(message)
//         ElMessage.info('自动重新获取中...')
//         await freshFileList(getFileListFormRef.value)
//       }
//     })) ?? 'failed'

//   if (!response || response === 'failed') return

//   const { data } = response
//   ElMessage.success('解析成功')

//   dlinkList.value = data
//   downloadDialogVisible.value = true
// }

// const downloadFiles = async () => {
//   getFileListForm.value.pending = true
//   let bad = false
//   selectedRows.value = selectedRows.value.filter(item => {
//     if (bad) return false
//     const bool = item.isdir == '1'
//     if (bool) {
//       bad = true
//       ElMessage.error('请勿勾选文件夹')
//       fileListTableRef.value?.clearSelection()
//     }
//     return !bool
//   })

//   if (bad) {
//     getFileListForm.value.pending = false
//     return
//   }

//   // 收集fids
//   const fs_ids: string[] = selectedRows.value.map(item => item.fs_id)
//   await downloadFile(fs_ids)
//   getFileListForm.value.pending = false
// }

// const clickSelection = (row: any) => (selectedRows.value = row)

// import axios from '@/utils/request.js'

// const sendDownloadFile = async (dlink: string, filename: string) => {
//   const response =
//     (await axios
//       .post(`${aria2ConfigForm.value.host}:${aria2ConfigForm.value.port}/jsonrpc`, {
//         jsonrpc: '2.0',
//         id: getAppName(),
//         method: 'aria2.addUri',
//         params: [
//           `token:${aria2ConfigForm.value.secret}`,
//           [dlink],
//           {
//             out: filename,
//             header: [`User-Agent: ${config.value.userAgent}`]
//           }
//         ]
//       })
//       .catch(() => {
//         ElMessage.error('发送失败，请检查控制台输出')
//       })) ?? 'failed'

//   // @ts-ignore
//   if (response === 'failed') return

//   ElMessage.success(`已把${filename}任务发送给下载器`)
// }

// const selectDownloadFilesChange = (row: any) => (selectDownloadFiles.value = row)

// const openAria2ConfigDialog = () => (aria2ConfigDialogVisible.value = true)

// const sendDownloadFiles = async () => {
//   ElMessage.error('请确保最大同时下载文件数在5及以下,否则可能下载失败!')
//   ElMessage.error('请确保最大同时下载文件数在5及以下,否则可能下载失败!')
//   ElMessage.error('请确保最大同时下载文件数在5及以下,否则可能下载失败!')
//   await sleep(3000)
//   ElMessage.success('开始下载')
//   selectDownloadFiles.value.forEach(item => sendDownloadFile(item.dlink, item.server_filename))
// }

// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// const aria2ConfigFormRule = {
//   host: [{ required: true, message: '请输入Aria2 服务器地址', trigger: 'blur' }],
//   port: [{ required: true, message: '请输入Aria2 端口号', trigger: 'blur' }]
// }

// const saveAria2Config = async (formEl: FormInstance | null) => {
//   if (!formEl) return
//   if (!(await formEl.validate(() => {}))) return
//   localStorage.setItem('aria2_config', JSON.stringify(aria2ConfigForm.value))
//   ElMessage.success('保存成功')
//   aria2ConfigDialogVisible.value = false
// }
</script>

<style lang="scss">
.card,
.table,
.form,
.alert {
  margin-top: 15px;
}

img {
  width: 20px;
  height: 20px;
}
</style>
