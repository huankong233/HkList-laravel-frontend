<template>
  <el-dialog v-model="config.announceSwitch" title="公告" width="90%">
    <span v-html="config.announce"></span>
  </el-dialog>

  <el-dialog v-model="aria2ConfigDialogVisible" title="Aria2配置" width="90%">
    <el-form
      ref="aria2ConfigFormRef"
      :model="aria2ConfigForm"
      :rules="aria2ConfigFormRule"
      label-width="200px"
    >
      <el-form-item label="Aria2 服务器地址" prop="host">
        <el-input v-model="aria2ConfigForm.host"></el-input>
      </el-form-item>
      <el-form-item label="Aria2 端口号" prop="port">
        <el-input v-model="aria2ConfigForm.port"></el-input>
      </el-form-item>
      <el-form-item label="Aria2 下载密钥" prop="secret">
        <el-input v-model="aria2ConfigForm.secret"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="saveAria2Config(aria2ConfigFormRef)">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="downloadDialogVisible" title="解析任务列表" width="80%">
    <el-space>
      <el-text class="mx-1">当前的UA :</el-text>
      <el-link type="danger" @click="copy(config.userAgent, '已复制UA')">{{
        config.userAgent
      }}</el-link>
      <el-button
        type="primary"
        :disabled="selectDownloadFiles.length <= 0"
        @click="sendDownloadFiles"
      >
        批量下载
      </el-button>
      <el-button type="primary" @click="openAria2ConfigDialog">下载配置</el-button>
    </el-space>
    <el-table
      border
      show-overflow-tooltip
      class="table"
      :data="dlinkList"
      @selection-change="selectDownloadFilesChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="server_filename" label="文件名"></el-table-column>
      <el-table-column prop="dlink" label="下载链接"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="copy(scope.row.dlink, '已将链接复制到粘贴板内')"
          >
            复制链接
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="sendDownloadFile(scope.row.dlink, scope.row.server_filename)"
          >
            发送Aria2
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-card v-loading="config.pending || getFileListForm.pending">
    <h2>前台解析中心 | {{ getAppName() }}</h2>

    <el-alert title="当前中转账号充足" type="success" v-if="config.haveAccount"></el-alert>
    <el-alert title="当前中转账号不足" type="error" v-else></el-alert>

    <el-alert
      class="alert"
      title="当前网站开启了DEBUG模式,非调试请关闭!!!!"
      type="error"
      v-if="config.debug"
    ></el-alert>

    <el-alert
      class="alert"
      title="当前网站未开启SSL,可能出现无法请求Aria2服务器的问题"
      type="error"
      v-if="!ishttps"
    ></el-alert>

    <el-form
      ref="getFileListFormRef"
      :model="getFileListForm"
      :rules="getFileListFormRule"
      label-width="100"
      class="form"
    >
      <el-form-item label="链接" prop="url">
        <el-input v-model="getFileListForm.url" @blur="checkLink"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="getFileListForm.password"></el-input>
      </el-form-item>
      <el-form-item label="指定用户解析" prop="bd_user_id" v-if="getLoginState() === '1'">
        <el-input v-model="getFileListForm.bd_user_id"></el-input>
      </el-form-item>
      <el-form-item label="当前路径" prop="dir">
        <el-input v-model="getFileListForm.dir" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getFileListClickEvent(getFileListFormRef)">
          解析链接
        </el-button>
        <el-button type="primary" @click="freshFileList(getFileListFormRef)"> 刷新列表 </el-button>
        <el-button type="primary" :disabled="selectedRows.length <= 0" @click="downloadFiles">
          批量下载
        </el-button>
        <el-button type="primary" @click="copyLink(getFileListFormRef)"> 复制当前地址 </el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="card" v-loading="getFileListForm.pending">
    <el-table
      border
      stripe
      ref="fileListTableRef"
      :data="list"
      @row-click="clickRow"
      @row-dblclick="dblclickRow"
      @selection-change="clickSelection"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="文件名">
        <template #default="scope">
          <el-space wrap>
            <img :src="scope.row.isdir == '1' ? folder : unknownfile" />
            {{ scope.row.server_filename }}
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template #default="scope"> {{ formatTimestamp(scope.row.server_mtime) }} </template>
      </el-table-column>
      <el-table-column label="大小">
        <template #default="scope"> {{ formatBytes(scope.row.size) }} </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { getAppName } from '@/utils/env.js'
import { storeToRefs } from 'pinia'
import { useUserPannelStore } from '@/store/UserPannel.js'
import { onMounted } from 'vue'
import { doGetConfig, doGetFileList, doGetSign } from '@/apis/user'
import { getLoginState } from '@/utils/env.js'
import { formatBytes, formatTimestamp } from '@/utils/format.js'
import folder from '@/assets/image/folder.png'
import unknownfile from '@/assets/image/unknownfile.png'
import { ElMessage } from 'element-plus'
import Clipboard from 'clipboard'
import { doDownloadFiles } from '@/apis/user.js'
import { useRoute } from 'vue-router'

const userPannelStore = useUserPannelStore()
const {
  config,
  ishttps,
  getFileListForm,
  getFileListFormRef,
  list,
  dlinkList,
  selectedRows,
  fileListTableRef,
  downloadDialogVisible,
  aria2ConfigForm,
  aria2ConfigFormRef,
  selectDownloadFiles,
  aria2ConfigDialogVisible
} = storeToRefs(userPannelStore)

const route = useRoute()
Object.assign(getFileListForm.value, route.query)

async function getConfig() {
  config.value.pending = true
  const response = (await doGetConfig()) ?? 'failed'
  config.value.pending = false

  // @ts-ignore
  if (response === 'failed') return

  config.value = {
    ...config.value,
    ...response.data,
    announce: response.data.announce.replaceAll('[NextLine]', '<br>')
  }
}

onMounted(() => {
  getConfig()
})

const getUrlId = (url: string) => {
  const fullMatch = url.match(/s\/([a-zA-Z0-9_-]+)/)
  const passwordMatch = url.match(/\?pwd=([a-zA-Z0-9_-]+)/)
  if (fullMatch) {
    return {
      id: fullMatch[1],
      password: passwordMatch ? passwordMatch[1] : null
    }
  }

  return false
}

const urlValidator = (rule: any, value: string, callback: any) => {
  if (value === '') {
    return callback(new Error('请先输入需要解析的链接'))
  }

  if (getUrlId(value)) {
    return callback()
  } else {
    return callback(new Error('请输入合法的链接'))
  }
}

const getFileListFormRule: FormRules = {
  url: [{ required: true, validator: urlValidator, trigger: 'blur' }]
}

const checkLink = () => {
  list.value = []
  getFileListForm.value.dir = '/'
  selectedRows.value = []

  const data = getUrlId(getFileListForm.value.url)
  if (!data) return
  if (data.id) getFileListForm.value.url = `https://pan.baidu.com/s/${data.id}`
  if (data.password) {
    getFileListForm.value.password = data.password
    ElMessage.success('已自动填写密码')
  }
}

const getFileListClickEvent = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  getFileListForm.value.pending = true

  // 如果获取列表成功再获取签名
  if (await getFileList()) await getFileSign()

  getFileListForm.value.pending = false
}

// 根据路径生成上一个路径的地址
const getPreviousPath = () => {
  let newArr = getFileListForm.value.dir.split('/')
  newArr.pop()
  const newPath = newArr.join('/')
  return newPath === '' ? '/' : newPath
}

const getFileList = async (server_mtime = '0', refresh = false) => {
  const fileList =
    (await doGetFileList({
      url: getFileListForm.value.url,
      password: getFileListForm.value.password,
      dir: getFileListForm.value.dir
    })) ?? 'failed'

  // @ts-ignore
  if (fileList === 'failed') return

  let { message, data } = fileList
  ElMessage.success(message)

  Object.assign(getFileListForm.value, { randsk: data.randsk, uk: data.uk, shareid: data.shareid })
  list.value = data.list

  if (
    getFileListForm.value.dir !== null &&
    getFileListForm.value.dir !== '' &&
    getFileListForm.value.dir !== '/'
  ) {
    list.value = [
      {
        isdir: '1',
        path: getPreviousPath(),
        server_filename: '..',
        size: '0',
        server_mtime: refresh ? list.value[0].server_mtime : server_mtime
      },
      ...data.list
    ]
  } else {
    list.value = data.list
  }

  return 'success'
}

const getFileSign = async () => {
  const response =
    (await doGetSign({
      uk: getFileListForm.value.uk,
      shareid: getFileListForm.value.shareid
    })) ?? 'failed'

  // @ts-ignore
  if (response === 'failed') return

  const { message, data } = response
  ElMessage.success(message)

  Object.assign(getFileListForm.value, data)
}

const freshFileList = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  getFileListForm.value.pending = true
  await getFileList('0', true)
  await getFileSign()
  getFileListForm.value.pending = false
}

const copy = (text: string, message: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  new Clipboard(textarea, {
    text: () => text
  })
  textarea.click()
  document.body.removeChild(textarea)

  if (message) {
    ElMessage({
      message: message,
      type: 'success'
    })
  }
}

const copyLink = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  copy(
    `${location.host}/?url=${getFileListForm.value.url}&password=${getFileListForm.value.password}&dir=${getFileListForm.value.dir}`,
    '复制成功'
  )
}

const clickRow = async (scope: any) => {
  if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) return
  getFileListForm.value.pending = true
  if (scope.isdir === '1' || scope.isdir === 1) {
    await getDir(scope.path, scope.server_mtime)
  } else {
    await downloadFile(scope.fs_id)
  }
  getFileListForm.value.pending = false
}

const dblclickRow = async (scope: any) => {
  getFileListForm.value.pending = true
  if (scope.isdir === '1' || scope.isdir === 1) {
    await getDir(scope.path, scope.server_mtime)
  } else {
    await downloadFile(scope.fs_id)
  }
  getFileListForm.value.pending = false
}

const getDir = async (path: string, server_mtime: string) => {
  getFileListForm.value.dir = path
  await getFileList(server_mtime)
}

const downloadFile = async (fs_id: string[] | string) => {
  const response =
    (await doDownloadFiles({
      // 如果fs_id是数组则表示批量下载
      // 否则就是单个下载手动修改成数组
      fs_ids: Array.isArray(fs_id) ? fs_id : [fs_id],
      ...getFileListForm.value
    }).catch(async error => {
      const { message } = error
      if (message.includes('当前签名已过期')) {
        ElMessage.error(message)
        ElMessage.info('自动重新获取中...')
        await freshFileList(getFileListFormRef.value)
      }
    })) ?? 'failed'

  if (!response || response === 'failed') return

  const { data } = response
  ElMessage.success('解析成功')

  dlinkList.value = data
  downloadDialogVisible.value = true
}

const downloadFiles = async () => {
  getFileListForm.value.pending = true
  let bad = false
  selectedRows.value = selectedRows.value.filter(item => {
    if (bad) return false
    const bool = item.isdir == '1'
    if (bool) {
      bad = true
      ElMessage.error('请勿勾选文件夹')
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

const clickSelection = (row: any) => (selectedRows.value = row)

import axios from '@/utils/request.js'

const sendDownloadFile = async (dlink: string, filename: string) => {
  const response =
    (await axios
      .post(`${aria2ConfigForm.value.host}:${aria2ConfigForm.value.port}/jsonrpc`, {
        jsonrpc: '2.0',
        id: getAppName(),
        method: 'aria2.addUri',
        params: [
          `token:${aria2ConfigForm.value.secret}`,
          [dlink],
          {
            out: filename,
            header: [`User-Agent: ${config.value.userAgent}`]
          }
        ]
      })
      .catch(() => {
        ElMessage.error('发送失败，请检查控制台输出')
      })) ?? 'failed'

  // @ts-ignore
  if (response === 'failed') return

  ElMessage.success(`已把${filename}任务发送给下载器`)
}

const selectDownloadFilesChange = (row: any) => (selectDownloadFiles.value = row)

const openAria2ConfigDialog = () => (aria2ConfigDialogVisible.value = true)

const sendDownloadFiles = async () => {
  ElMessage.error('请确保最大同时下载文件数在5及以下,否则可能下载失败!')
  ElMessage.error('请确保最大同时下载文件数在5及以下,否则可能下载失败!')
  ElMessage.error('请确保最大同时下载文件数在5及以下,否则可能下载失败!')
  await sleep(3000)
  ElMessage.success('开始下载')
  selectDownloadFiles.value.forEach(item => sendDownloadFile(item.dlink, item.server_filename))
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const aria2ConfigFormRule = {
  host: [{ required: true, message: '请输入Aria2 服务器地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入Aria2 端口号', trigger: 'blur' }]
}

const saveAria2Config = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return
  localStorage.setItem('aria2_config', JSON.stringify(aria2ConfigForm.value))
  ElMessage.success('保存成功')
  aria2ConfigDialogVisible.value = false
}
</script>

<style lang="scss" scoped>
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
