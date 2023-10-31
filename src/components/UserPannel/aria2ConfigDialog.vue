<template>
  <el-dialog v-model="aria2ConfigDialogVisible" title="Aria2配置" width="90%">
    <el-form
      ref="aria2ConfigFormRef"
      :model="aria2ConfigForm"
      :rules="aria2ConfigFormRule"
      label-width="auto"
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
      <el-form-item label=" ">
        <el-button type="primary" @click="userPannelStore.saveAria2Config(aria2ConfigFormRef)">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUserPannelStore } from '@/store/UserPannel.js'

const userPannelStore = useUserPannelStore()
const { aria2ConfigForm, aria2ConfigFormRef, aria2ConfigDialogVisible } =
  storeToRefs(userPannelStore)

const aria2ConfigFormRule = {
  host: [{ required: true, message: '请输入Aria2 服务器地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入Aria2 端口号', trigger: 'blur' }]
}
</script>

<style lang="scss" scoped></style>
