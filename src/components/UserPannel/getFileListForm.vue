<template>
  <el-card v-loading="clientConfig.pending || getFileListForm.pending">
    <h2>前台解析中心 | {{ getAppName() }}</h2>

    <el-alert title="当前中转账号充足" type="success" v-if="clientConfig.haveAccount"></el-alert>
    <el-alert title="当前中转账号不足" type="error" v-else></el-alert>

    <el-alert
      class="alert"
      title="当前网站开启了DEBUG模式,非调试请关闭!!!!"
      type="error"
      v-if="clientConfig.debug"
    ></el-alert>

    <el-alert
      class="alert"
      title="当前网站未开启SSL,可能出现无法请求Aria2服务器的问题"
      type="error"
      v-if="!clientConfig.ishttps"
    ></el-alert>

    <el-form
      ref="getFileListFormRef"
      :model="getFileListForm"
      :rules="getFileListFormRule"
      label-width="auto"
      class="form"
    >
      <el-form-item label="链接" prop="url">
        <el-input v-model.trim="getFileListForm.url" @blur="checkLink()"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model.trim="getFileListForm.pwd"></el-input>
      </el-form-item>
      <el-form-item label="解析密码" prop="password" v-if="clientConfig.havePassword">
        <el-input v-model.trim="getFileListForm.password"></el-input>
      </el-form-item>
      <el-form-item label="指定用户解析" prop="bd_user_id" v-if="getLoginState() === '1'">
        <el-input v-model.trim="getFileListForm.bd_user_id"></el-input>
      </el-form-item>
      <el-form-item label="当前路径" prop="dir">
        <el-input v-model="getFileListForm.dir" disabled></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="getFileListFormClick(getFileListFormRef)">
          解析链接
        </el-button>
        <el-button type="primary" @click="userPannelStore.freshFileList(getFileListFormRef)">
          刷新列表
        </el-button>
        <el-button
          type="primary"
          :disabled="selectedRows.length <= 0"
          @click="userPannelStore.downloadFiles"
        >
          批量解析
        </el-button>
        <el-button type="primary" @click="copyLink(getFileListFormRef)"> 复制当前地址 </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { getAppName, getLoginState } from '@/utils/env.js'
import { storeToRefs } from 'pinia'
import { useUserPannelStore } from '@/store/UserPannel.js'
import { copy } from '@/utils/copy.js'
import { ElMessage } from 'element-plus'

const userPannelStore = useUserPannelStore()
const { clientConfig, getFileListForm, getFileListFormRef, selectedRows } =
  storeToRefs(userPannelStore)

const checkLink = () => {
  const data = getUrlId(getFileListForm.value.url)
  if (!data) return
  if (data.id) getFileListForm.value.url = `https://pan.baidu.com/s/${data.id}`
  if (data.pwd) {
    getFileListForm.value.pwd = data.pwd
    ElMessage.success('已自动填写密码')
  }
}

const getUrlId = (url: string) => {
  const fullMatch = url.match(/s\/([a-zA-Z0-9_-]+)/)
  const pwdMatch = url.match(/\?pwd=([a-zA-Z0-9_-]+)/)
  const pwdMatch2 = url.match(/提取码:\s?([a-zA-Z0-9_-]+)/)
  if (fullMatch) {
    if (pwdMatch) {
      return {
        id: fullMatch[1],
        pwd: pwdMatch ? pwdMatch[1] : null
      }
    } else if (pwdMatch2) {
      return {
        id: fullMatch[1],
        pwd: pwdMatch2 ? pwdMatch2[1] : null
      }
    } else {
      return {
        id: fullMatch[1]
      }
    }
  }

  return false
}

const urlValidator = (rule: any, value: string, callback: any) => {
  if (value === '') {
    return callback(new Error('请先输入需要解析的链接'))
  }

  if (getUrlId(value)) {
    return callback()
  } else {
    return callback(new Error('请输入合法的链接'))
  }
}

const getFileListFormRule: FormRules = {
  url: [{ required: true, validator: urlValidator, trigger: 'blur' }]
}

const getFileListFormClick = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  getFileListForm.value.pending = true

  // 如果获取列表成功再获取签名
  if (await userPannelStore.getFileList()) await userPannelStore.getFileSign()

  getFileListForm.value.pending = false
}

const copyLink = async (formEl: FormInstance | null) => {
  if (!formEl) return
  if (!(await formEl.validate(() => {}))) return

  copy(
    `${location.host}/?url=${getFileListForm.value.url}&pwd=${getFileListForm.value.pwd}&dir=${getFileListForm.value.dir}`,
    '复制成功'
  )
}
</script>

<style lang="scss" scoped></style>
