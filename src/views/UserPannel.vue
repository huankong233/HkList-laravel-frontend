<template>
  <SelectLink />
  <!--
  <el-dialog v-model="configAria2FormVisible" title="Aria2配置" width="90%">
    <el-form
      ref="configAria2FormRef"
      v-bind:model="configAria2Form"
      v-bind:rules="configAria2FormRule"
      label-width="200px"
    >
      <el-form-item label="Aria2 服务器地址" prop="host">
        <el-input v-model="configAria2Form.host"></el-input>
      </el-form-item>
      <el-form-item label="Aria2 端口号" prop="port">
        <el-input v-model="configAria2Form.port"></el-input>
      </el-form-item>
      <el-form-item label="Aria2 下载密钥" prop="secret">
        <el-input v-model="configAria2Form.secret"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="configAria2(configAria2FormRef)"> 保存 </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="downloadDialogVisible" title="解析任务列表" width="80%">
    <el-space>
      <el-text class="mx-1">当前的UA :</el-text>
      <el-link type="danger" @click="copy(user_agent, '已复制UA')">{{ user_agent }}</el-link>
      <el-button
        type="primary"
        v-bind:disabled="selectDownloadFiles.length <= 0"
        @click="sendDownloadFiles"
      >
        批量下载
      </el-button>
      <el-button type="primary" @click="openDownloadListDialog">下载配置</el-button>
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
  -->
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const SelectLink = defineAsyncComponent(() => import('@/components/UserPannel/SelectLink.vue'))
</script>

<style lang="scss" scoped>
.card {
  margin-top: 15px;
}
</style>
