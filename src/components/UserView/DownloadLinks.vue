<template>
  <el-card class="card" v-if="downloadLinks.length !== 0">
    <h2>链接列表</h2>
    <h3>下载请推荐使用Aria2下载器,如 <a href="https://motrix.app/">Motrix</a></h3>
    <h3>IDM下载需要手动指定UA,点击即可复制</h3>
    <h3>如果当前链接下载失败,请尝试更换链接,如果全部不可用可以单独重新解析单个文件</h3>

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
            {{ row.ua ?? row.url }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="filename" label="文件名"></el-table-column>
      <el-table-column prop="url" label="下载链接">
        <template #default="{ row }">
          {{ row.urls ? row.urls[row.index] : row.url }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="450">
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            @click="copy(row.urls ? row.urls[row.index] : row.url, '已将链接复制到粘贴板内')"
          >
            复制链接
          </el-button>
          <el-button type="primary" size="small" @click="sendDownloadFile(row)">
            发送Aria2
          </el-button>
          <template v-if="row.urls">
            <el-button
              type="danger"
              size="small"
              @click="changeUrl($index)"
              v-if="row.index < row.urls.length - 1"
            >
              更换链接 (当前第{{ row.index + 1 }}条链接)
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="getDownloadLinks($index, row.fs_id)"
              v-else
            >
              重新解析
            </el-button>
          </template>
          <template v-else>
            <el-button type="danger" size="small" @click="getDownloadLinks($index, row.fs_id)">
              重新解析
            </el-button>
          </template>
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
      method: 'aria2.getVersion',
      params: [`token:${aria2ConfigForm.value.token}`]
    })
  } catch (error) {
    return ElMessage.error('检查 Aria2 服务状态失败')
  }

  try {
    await axios.post(`${aria2ConfigForm.value.host}:${aria2ConfigForm.value.port}/jsonrpc`, {
      jsonrpc: '2.0',
      id: getAppName(),
      method: 'aria2.addUri',
      params: [
        `token:${aria2ConfigForm.value.token}`,
        [row.urls ? row.urls[row.index] : row.url],
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

const changeUrl = (index: number) => {
  downloadLinks.value[index].index++
}
</script>

<style lang="scss" scoped></style>
