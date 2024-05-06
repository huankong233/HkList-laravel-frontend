<template>
  <el-dialog v-model="downloadDialogVisible" title="解析任务列表" width="80%">
    <el-space>
      <el-text class="mx-1">当前的UA :</el-text>
      <el-link type="danger" @click="copy(clientConfig.userAgent, '已复制UA')">
        {{ clientConfig.userAgent }}
      </el-link>
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
      <el-table-column prop="dlink" label="下载链接">
        <!-- <template #default="scope">
          <el-link type="danger" @click="downlaod(scope.row.dlink, scope.row.server_filename)">
            {{ scope.row.dlink }}
          </el-link>
        </template> -->
      </el-table-column>
      <el-table-column label="操作" width="190">
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
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUserPannelStore } from '@/store/UserPannel.js'
import { copy } from '@/utils/copy.js'
import { sleep } from '@/utils/sleep.js'
import { getAppName } from '@/utils/env.js'
import { ElMessage } from 'element-plus'
import axios from '@/utils/request.js'
import type { _response } from '@/utils/request.js'

const userPannelStore = useUserPannelStore()
const {
  clientConfig,
  dlinkList,
  downloadDialogVisible,
  selectDownloadFiles,
  aria2ConfigForm,
  aria2ConfigDialogVisible
} = storeToRefs(userPannelStore)

const sendDownloadFile = async (dlink: string, filename: string) => {
  let response: _response | 'failed'

  try {
    response = await axios.post(
      `${aria2ConfigForm.value.host}:${aria2ConfigForm.value.port}/jsonrpc`,
      {
        jsonrpc: '2.0',
        id: getAppName(),
        method: 'aria2.addUri',
        params: [
          `token:${aria2ConfigForm.value.secret}`,
          [dlink],
          {
            out: filename,
            header: [`User-Agent: ${clientConfig.value.userAgent}`]
          }
        ]
      }
    )
  } catch (error) {
    ElMessage.error('发送失败，请检查控制台输出，自行谷歌搜索或拉起issue')
    response = 'failed'
  }

  if (response === 'failed') return

  ElMessage.success(`已把${filename}任务发送给下载器`)
}

const selectDownloadFilesChange = (row: any) => (selectDownloadFiles.value = row)

const openAria2ConfigDialog = () => (aria2ConfigDialogVisible.value = true)

const sendDownloadFiles = async () => {
  ElMessage.error('请确保最大同时下载文件数在5及以下,否则可能出现下载失败!')
  await sleep(3000)
  ElMessage.success('开始下载')
  selectDownloadFiles.value.forEach((item: any) =>
    sendDownloadFile(item.dlink, item.server_filename)
  )
}

// const downlaod = async (url: string, filename: string) => {
//   const blob = await axios.get(url, {
//     headers: {
//       'User-Agent': clientConfig.value.userAgent
//     },
//     responseType: 'blob'
//   })

//   if (blob instanceof Blob) {
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = filename
//     a.click()
//     URL.revokeObjectURL(url)
//     a.remove()
//   }
// }
</script>

<style lang="scss" scoped></style>
