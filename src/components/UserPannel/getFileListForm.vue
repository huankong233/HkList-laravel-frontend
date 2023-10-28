<template>
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
      label-width="auto"
      class="form"
    >
      <el-form-item label="链接" prop="url">
        <el-input v-model.trim="getFileListForm.url" @blur="checkLink"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="getFileListForm.password"></el-input>
      </el-form-item>
      <el-form-item label="指定用户解析" prop="bd_user_id" v-if="getLoginState() === '1'">
        <el-input v-model.trim="getFileListForm.bd_user_id"></el-input>
      </el-form-item>
      <el-form-item label="当前路径" prop="dir">
        <el-input v-model="getFileListForm.dir" disabled></el-input>
      </el-form-item>
      <el-form-item label=" ">
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
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
