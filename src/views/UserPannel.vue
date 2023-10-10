<template>
  <el-dialog v-model="Announce.switch" title="公告" width="90%">
    <span v-html="Announce.message"></span>
  </el-dialog>

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

  <el-card v-loading="getFileListForm.pending">
    <h2>前台解析中心 | {{ getAppName() }}</h2>
    <!-- @if(\App\Http\Controllers\UserController::getRandomCookie() === null)
    <el-alert title="当前中转账号不足" type="error"></el-alert>
    @else
    <el-alert title="当前中转账号充足" type="success"></el-alert>
    @endif @if(config("app.debug") === true)
    <el-alert
      class="alert"
      title="当前网站开启了DEBUG模式,非调试请关闭!!!!"
      type="error"
    ></el-alert>
    @endif @if(!Request::secure() && !config("94list.ssl"))
    <el-alert
      class="alert"
      title="当前网站未开启SSL,可能出现无法请求Aria2服务器的问题"
      type="error"
    ></el-alert>
    @endif -->
    <el-form
      ref="getFileListFormRef"
      v-bind:model="getFileListForm"
      v-bind:rules="getFileListFormRule"
      label-width="100"
      class="form"
    >
      <el-form-item label="链接" prop="url">
        <el-input v-model="getFileListForm.url" @blur="checkLink"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="getFileListForm.password"></el-input>
      </el-form-item>
      @if(Auth::check())
      <el-form-item label="指定用户解析" prop="bd_user_id">
        <el-input v-model="getFileListForm.bd_user_id"></el-input>
      </el-form-item>
      @endif
      <el-form-item label="当前路径" prop="dir">
        <el-input v-model="dir" disabled></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="getFileListClickEvent(getFileListFormRef)">
          解析链接
        </el-button>
        <el-button type="primary" v-on:click="freshFileList(getFileListFormRef)">
          刷新列表
        </el-button>
        <el-button
          type="primary"
          v-bind:disabled="selectedRows.length <= 0"
          v-on:click="downloadFiles"
        >
          批量解析
        </el-button>
        <el-button type="primary" v-on:click="copyLink(getFileListFormRef)">
          复制当前地址
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <!-- <el-card class="card" v-loading="getFileListForm.pending">
    <el-table
      border
      stripe
      ref="fileListTableRef"
      v-bind:data="list"
      @row-click="clickRow"
      @row-dblclick="dblclickRow"
      @selection-change="clickSelection"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="文件名">
        <template #default="scope">
          <el-space wrap>
            <img
              :src="scope.row.isdir == '1' ? foler : unknownfile"
              style="width: 20px; height: 20px"
            />
            @{{ scope.row.server_filename }}
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
  </el-card> -->
</template>

<script lang="ts" setup>
import { getAppName } from '@/utils/env.js'
import { formatBytes, formatTimestamp } from '@/utils/format.js'
import foler from '@/assets/img/folder.png'
import unknownfile from '@/assets/img/unknownfile.png'
</script>

<style lang="scss" scoped></style>
