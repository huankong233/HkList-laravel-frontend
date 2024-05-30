<template>
  <el-card class="card" v-if="downloadLinks.length !== 0">
    <h2>链接列表</h2>
    <el-space>
      <el-button
        type="primary"
        :disabled="selectDownloadFiles.length <= 0"
        @click="sendDownloadFiles()"
      >
        批量下载
      </el-button>
      <el-button type="primary" @click="openAria2ConfigDialog()">下载配置</el-button>
    </el-space>

    <el-table
      border
      show-overflow-tooltip
      class="table"
      :data="downloadLinks"
      @selection-change="selectDownloadFilesChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="ua" label="UA">
        <template #default="{ row }">
          <el-link type="danger" @click="copy(row.ua, '已复制UA')">
            {{ row.ua }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="filename" label="文件名"></el-table-column>
      <el-table-column prop="url" label="下载链接"></el-table-column>
      <el-table-column label="操作" width="270">
        <template #default="{ row, $index }">
          <el-button type="primary" size="small" @click="copy(row.url, '已将链接复制到粘贴板内')">
            复制链接
          </el-button>
          <el-button type="primary" size="small" @click="sendDownloadFile(row)">
            发送Aria2
          </el-button>
          <el-button type="danger" size="small" @click="getDownloadLinks($index, row.fs_id)">
            重新解析
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import * as ParseApi from '@/apis/user/parse.js'
import { useAria2Store } from '@/stores/aria2Store.js'
import { useFileListStore } from '@/stores/fileListStore.js'
import { copy } from '@/utils/copy.js'
import { getAppName } from '@/utils/env.js'
import axios from '@/utils/request.js'
import { sleep } from '@/utils/sleep.js'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const fileListStore = useFileListStore()
const { downloadLinks } = storeToRefs(fileListStore)

const selectDownloadFiles = ref<ParseApi.downloadLinks>([])

const selectDownloadFilesChange = (row: ParseApi.downloadLinks) => (selectDownloadFiles.value = row)

const aria2Store = useAria2Store()
const { aria2ConfigForm, aria2ConfigDialogVisible } = storeToRefs(aria2Store)

const sendDownloadFile = async (row: ParseApi.link) => {
  try {
    await axios.post(`${aria2ConfigForm.value.host}:${aria2ConfigForm.value.port}/jsonrpc`, {
      jsonrpc: '2.0',
      id: getAppName(),
      method: 'aria2.addUri',
      params: [
        `token:${aria2ConfigForm.value.token}`,
        [row.url],
        {
          out: row.filename,
          header: [`User-Agent: ${row.ua}`]
        }
      ]
    })
  } catch (error) {
    return ElMessage.error('发送失败, 请检查控制台输出, 自行谷歌搜索或提交issue')
  }

  ElMessage.success(`已把${row.filename}任务发送给下载器`)
}

const sendDownloadFiles = async () => {
  ElMessage.error('请确保最大同时下载文件数在5及以下,否则可能出现下载失败!')
  await sleep(3000)
  ElMessage.success('开始下载')
  selectDownloadFiles.value.forEach((row: ParseApi.link) => sendDownloadFile(row))
}

const openAria2ConfigDialog = () => (aria2ConfigDialogVisible.value = true)

const getDownloadLinks = async (index: number, fs_id: number) => {
  const res = await fileListStore.getDownloadLinks(fs_id, true)
  if (!res) return ElMessage.error('重新解析失败')
  downloadLinks.value[index] = res[0]
}
</script>

<style lang="scss" scoped></style>
