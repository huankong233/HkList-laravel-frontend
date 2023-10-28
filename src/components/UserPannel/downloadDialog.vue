<template>
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

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
