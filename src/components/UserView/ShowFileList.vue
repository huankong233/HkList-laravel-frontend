<template>
  <el-card class="card" v-loading="pending" v-if="fileList['list'].length > 0">
    <h2>文件列表</h2>
    <el-table
      border
      stripe
      ref="fileListTableRef"
      :data="fileList['list']"
      @row-click="clickRow"
      @row-dblclick="dblclickRow"
      @selection-change="clickSelection"
      class="table"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="文件名">
        <template #default="{ row }">
          <el-space wrap>
            <img :src="row.isdir === 1 ? folder : unknownfile" />
            {{ row.server_filename }}
          </el-space>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template #default="{ row }"> {{ formatTimestamp(row.server_mtime) }} </template>
      </el-table-column>
      <el-table-column label="大小">
        <template #default="{ row }"> {{ formatBytes(row.size) }} </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts" setup>
import * as ParseApi from '@/apis/user/parse.js'
import folder from '@/assets/image/folder.png'
import unknownfile from '@/assets/image/unknownfile.png'
import { useFileListStore } from '@/stores/fileListStore.js'
import { formatBytes, formatTimestamp } from '@/utils/format.js'
import { isMobile } from '@/utils/isMobile.js'
import type { TableInstance } from 'element-plus'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const fileListStore = useFileListStore()
const { pending, fileList, selectedRows, getFileListForm } = storeToRefs(fileListStore)

const fileListTableRef = ref<TableInstance | null>(null)

const clickSelection = (row: ParseApi.file[]) => (selectedRows.value = row)

const getDir = async (path: string) => {
  getFileListForm.value.dir = path
  await fileListStore.getFileList()
}

const clickRow = async (row: ParseApi.file) => {
  if (!isMobile()) return
  // 手机

  try {
    if (row.isdir === 1) {
      await getDir(row.path)
    } else {
      await fileListStore.getDownloadLinks(row.fs_id)
    }
  } finally {
    pending.value = false
  }
}

const dblclickRow = async (row: ParseApi.file) => {
  if (isMobile()) return
  // 电脑

  try {
    if (row.isdir === 1) {
      await getDir(row.path)
    } else {
      await fileListStore.getDownloadLinks(row.fs_id)
    }
  } finally {
    pending.value = false
  }
}
</script>

<style lang="scss" scoped>
.table {
  height: 500px;
}

img {
  width: 20px;
  height: 20px;
}
</style>
