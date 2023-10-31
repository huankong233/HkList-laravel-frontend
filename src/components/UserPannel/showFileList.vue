<template>
  <el-card class="card" v-loading="getFileListForm.pending">
    <el-table
      border
      stripe
      ref="fileListTableRef"
      :data="filelist"
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
import { storeToRefs } from 'pinia'
import type { file } from '@/store/UserPannel.js'
import { useUserPannelStore } from '@/store/UserPannel.js'
import { formatBytes, formatTimestamp } from '@/utils/format.js'
import folder from '@/assets/image/folder.png'
import unknownfile from '@/assets/image/unknownfile.png'

const userPannelStore = useUserPannelStore()
const { getFileListForm, filelist, selectedRows } = storeToRefs(userPannelStore)

const clickSelection = (row: file[]) => (selectedRows.value = row)

const clickRow = async (scope: any) => {
  if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) return
  getFileListForm.value.pending = true
  if (scope.isdir === '1' || scope.isdir === 1) {
    await userPannelStore.getDir(scope.path, scope.server_mtime)
  } else {
    await userPannelStore.downloadFile(scope.fs_id)
  }
  getFileListForm.value.pending = false
}

const dblclickRow = async (scope: any) => {
  getFileListForm.value.pending = true
  if (scope.isdir === '1' || scope.isdir === 1) {
    await userPannelStore.getDir(scope.path, scope.server_mtime)
  } else {
    await userPannelStore.downloadFile(scope.fs_id)
  }
  getFileListForm.value.pending = false
}
</script>

<style lang="scss" scoped></style>
