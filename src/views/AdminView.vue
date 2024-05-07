<template>
  <el-card class="box-card" v-if="getLoginState() === '1'">
    <h2>
      后台控制中心 | {{ getAppName() }}
      <el-button type="danger" @click="logout()"> 退出登陆 </el-button>
    </h2>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础配置" name="changeMainConfig">
        <ChangeMainConfig />
      </el-tab-pane>
      <el-tab-pane label="邮件配置" name="changeMailConfig">
        <ChangeMailConfig />
      </el-tab-pane>
      <el-tab-pane label="用户管理" name="userManagement">
        <UserManagement />
      </el-tab-pane>
      <el-tab-pane label="邀请码管理" name="invCodeManagement">
        <InvCodeManagement />
      </el-tab-pane>
      <el-tab-pane label="用户组管理" name="groupManagement">
        <GroupManagement />
      </el-tab-pane>
      <el-tab-pane label="账号管理" name="accountManagement">
        <!-- <AccountManagement /> -->
      </el-tab-pane>
      <el-tab-pane label="记录管理" name="recordManagement">
        <!-- <RecordManagement /> -->
      </el-tab-pane>
      <el-tab-pane label="黑白名单管理" name="ipManagement">
        <!-- <IpManagement /> -->
      </el-tab-pane>
      <el-tab-pane label="开源说明" name="openSourceNotice">
        <el-card>
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
import * as UserApi from '@/apis/user/user.js'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const ChangeMainConfig = defineAsyncComponent(
  () => import('@/components/AdminView/Config/ChangeMainConfig.vue')
)

const ChangeMailConfig = defineAsyncComponent(
  () => import('@/components/AdminView/Config/ChangeMailConfig.vue')
)

const UserManagement = defineAsyncComponent(
  () => import('@/components/AdminView/User/UserManagement.vue')
)

const InvCodeManagement = defineAsyncComponent(
  () => import('@/components/AdminView/InvCode/InvCodeManagement.vue')
)

const GroupManagement = defineAsyncComponent(
  () => import('@/components/AdminView/Group/GroupManagement.vue')
)

const activeName = ref('changeMainConfig')
const router = useRouter()
if (getLoginState() === '0') router.push('/login')
const logout = async () => {
  try {
    await UserApi.logout()
  } finally {
    setLoginState('0')
    router.push('/')
    ElMessage.success('退出登陆成功~')
  }
}
</script>

<style lang="scss" scoped></style>
