<template>
  <el-card v-loading="pending">
    <h2>前台解析中心 | {{ getAppName() }}</h2>

    <el-alert title="当前中转账号充足" type="success" v-if="config.have_account" />
    <el-alert title="当前中转账号不足" type="error" v-else />

    <el-alert
      class="alert"
      title="当前网站开启了DEBUG模式,非调试请关闭!!!!"
      type="error"
      v-if="config.debug"
    />

    <el-alert
      class="alert"
      title="当前网站未开启SSL,可能出现无法请求Aria2服务器的问题"
      type="error"
      v-if="!config.is_https"
    />

    <el-alert
      class="alert"
      :type="hitLimit ? 'error' : 'success'"
      :title="
        hitLimit
          ? '当前用户配额已用完'
          : `当前用户组: ${limitForm.group_name} 当前剩余解析次数: ${limitForm.count} 当前剩余解析大小: ${formatBytes(limitForm.size)}`
      "
    />

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
      <el-form-item label="解析密码" prop="password" v-if="config.need_password">
        <el-input v-model.trim="getFileListForm.password"></el-input>
      </el-form-item>
      <el-form-item label="当前路径" prop="dir">
        <el-input v-model="getFileListForm.dir" disabled></el-input>
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="fileListStore.getFileList()">获取/刷新列表</el-button>
        <el-button
          type="primary"
          :disabled="selectedRows.length <= 0"
          @click="fileListStore.getDownloadLinks()"
        >
          批量解析
        </el-button>
        <el-button type="primary" @click="copyLink(getFileListFormRef)">复制当前地址</el-button>
        <el-button type="primary" @click="goLogin()" v-if="getLoginState() === '0'">登陆</el-button>
        <el-button type="danger" @click="mainStore.logout()" v-if="getLoginState() === '1'"
          >注销</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { useFileListStore } from '@/stores/fileListStore.js'
import { useMainStore } from '@/stores/mainStore.js'
import { copy } from '@/utils/copy.js'
import { getAppName, getLoginState } from '@/utils/env.js'
import { formatBytes } from '@/utils/format.js'
import type { RuleItem } from 'async-validator'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const fileListStore = useFileListStore()
const { pending, getFileListForm, getFileListFormRef, selectedRows, limitForm, hitLimit } =
  storeToRefs(fileListStore)
const mainStore = useMainStore()
const { config } = storeToRefs(mainStore)

const urlValidator: RuleItem['validator'] = (rule, value, callback) => {
  if (value === '') return callback(new Error('请先输入需要解析的链接'))
  return getUrlId(value) ? callback() : callback(new Error('请输入合法的链接'))
}

const checkLink = () => {
  getFileListForm.value.dir = '/'
  getFileListForm.value.surl = ''

  const data = getUrlId(getFileListForm.value.url)
  if (!data) return
  if (data.id) {
    if (data.surl) {
      getFileListForm.value.url = `https://pan.baidu.com/share/init?surl=${data.id}`
    } else {
      getFileListForm.value.url = `https://pan.baidu.com/s/${data.id}`
    }
    getFileListForm.value.surl = data.id
  }

  if (data.pwd) {
    getFileListForm.value.pwd = data.pwd
    ElMessage.success('已自动填写密码')
  }
}

const getUrlId = (url: string) => {
  const fullMatch = url.match(/s\/([a-zA-Z0-9_-]+)/)
  const fullMatch2 = url.match(/surl=([a-zA-Z0-9_-]+)/)
  const pwdMatch = url.match(/\?pwd=([a-zA-Z0-9_-]+)/)
  const pwdMatch2 = url.match(/&pwd=([a-zA-Z0-9_-]+)/)
  const pwdMatch3 = url.match(/提取码:\s?([a-zA-Z0-9_-]+)/)

  let id: string
  if (fullMatch2) {
    id = fullMatch2[1]
  } else if (fullMatch) {
    id = fullMatch[1]
  } else {
    return false
  }

  const pwd = pwdMatch ? pwdMatch[1] : pwdMatch2 ? pwdMatch2[1] : pwdMatch3 ? pwdMatch3[1] : null
  return fullMatch2 ? { surl: true, id, pwd } : { id, pwd }
}

const getFileListFormRule: FormRules = {
  url: [{ required: true, validator: urlValidator, trigger: 'blur' }]
}

const copyLink = async (formEl: FormInstance | null) => {
  if (!formEl || !(await formEl.validate())) return

  const search = new URLSearchParams()
  search.set('url', getFileListForm.value.url)
  search.set('surl', getFileListForm.value.surl)
  search.set('pwd', getFileListForm.value.pwd)
  search.set('dir', getFileListForm.value.dir)

  copy(`${location.host}/?${search.toString()}`, '复制成功')
}

onMounted(() => {
  nextTick(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.size < 4) return

    getFileListForm.value = {
      url: searchParams.get('url') ?? '',
      pwd: searchParams.get('pwd') ?? '',
      dir: searchParams.get('dir') ?? '/',
      surl: searchParams.get('surl') ?? ''
    }

    ElMessage.success('已读取到参数,正在加载')

    setTimeout(fileListStore.getFileList, 1000)
  })
  fileListStore.getLimit()
})

const router = useRouter()
const goLogin = () => router.push('/login')
</script>

<style lang="scss" scoped>
img:hover {
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
