<template>
  <el-card class="box-card" v-if="getLoginState() === '1'">
    <h2>
      后台控制中心 | {{ getAppName() }}
      <el-button type="danger" @click="logout()"> 退出登陆 </el-button>
    </h2>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础配置" name="changeConfig">
        <ChangeConfig />
      </el-tab-pane>
      <el-tab-pane label="修改用户信息" name="changeUserInfo">
        <ChangeUserInfo />
      </el-tab-pane>
      <el-tab-pane label="代理账号管理" name="accountManagement">
        <AddAccount />
        <AccountList />
      </el-tab-pane>
      <el-tab-pane label="开源说明" name="openSourceNotice">
        <el-card class="illustrate">
          <el-text>
            本程序是免费开源项目，核心代码均未加密，其要旨是为了方便文件分享与下载，重点是GET被没落的PHP语法学习。开源项目所涉及的接口均为官方开放接口，需使用正版SVIP会员账号进行代理提取高速链接，无破坏官方接口行为，本身不存违法。仅供自己参考学习使用。诺违规使用官方会限制或封禁你的账号，包括你的IP，如无官方授权进行商业用途会对你造成更严重后果。源码仅供学习，如无视声明使用产生正负面结果(限速，被封等)与都作者无关。
          </el-text>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import { getAppName, setLoginState, getLoginState } from '@/utils/env.js'
import { doLogout } from '@/apis/admin.js'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const activeName = ref('changeConfig')

const router = useRouter()

if (getLoginState() === '0') {
  ElMessage.error('请先登陆')
  router.push('/login')
}

const ChangeConfig = defineAsyncComponent(() => import('@/components/ChangeConfig.vue'))
const ChangeUserInfo = defineAsyncComponent(() => import('@/components/ChangeUserInfo.vue'))

const AddAccount = defineAsyncComponent(
  () => import('@/components/AccountManagement/AddAccount.vue')
)
const AccountList = defineAsyncComponent(
  () => import('@/components/AccountManagement/AccountList.vue')
)

const logout = async () => {
  await doLogout()
  ElMessage.success('退出登陆成功~')
  setLoginState('0')
  router.push('/login')
}
</script>

<style lang="scss" scoped></style>
