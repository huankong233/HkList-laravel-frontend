<template>
  <el-button type="primary" @click="accountManagement.openAddDialog"> 添加代理账号 </el-button>
  <el-button type="primary" :disabled="selectAccounts.length <= 0" @click="enableSelectAccounts">
    批量启用
  </el-button>
  <el-button type="primary" :disabled="selectAccounts.length <= 0" @click="blockSelectAccounts">
    批量禁用
  </el-button>

  <el-table
    v-loading="accountLoading"
    :data="accountList.data"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectAccountsChange"
  >
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="编号"> </el-table-column>
    <el-table-column prop="baidu_name" label="百度用户名"> </el-table-column>
    <el-table-column prop="netdisk_name" label="网盘用户名"> </el-table-column>
    <el-table-column prop="state" label="状态"> </el-table-column>
    <el-table-column prop="add_time" label="添加时间"> </el-table-column>
    <el-table-column prop="svip_end_time" label="SVIP到期时间"> </el-table-column>
    <el-table-column prop="use" label="最后有效时间"> </el-table-column>
    <el-table-column prop="vip_type" label="会员类型"> </el-table-column>
    <el-table-column prop="cookie" label="cookie值"> </el-table-column>
    <el-table-column prop="switch" label="是否启用">
      <template #default="scope"> {{ scope.row.switch === 0 ? '禁用' : '启用' }} </template>
    </el-table-column>
    <el-table-column label="操作" width="220">
      <template #default="scope">
        <el-button size="small" type="primary" @click="updateAccount(scope.row.id)">
          更新信息
        </el-button>
        <el-button
          size="small"
          :type="scope.row.switch === 0 ? 'success' : 'info'"
          @click="switchAccount(scope.row.id, scope.row.switch)"
        >
          {{ scope.row.switch === 0 ? '启用' : '禁用' }}
        </el-button>
        <el-button size="small" type="danger" @click="deleteAccount(scope.row.id)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    :current-page="currentPage"
    :page-size="pageSize"
    :total="accountList.total"
    hide-on-single-page
    @current-change="accountManagement.getAccounts"
  ></el-pagination>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { Account } from '@/store/AdminPannel/AccountManagement.js'
import { useAccountManagementStore } from '@/store/AdminPannel/AccountManagement.js'
import { doSwitchAccount, doDeleteAccount, doUpdateAccount } from '@/apis/admin.js'
import { ElMessage } from 'element-plus'

const accountManagement = useAccountManagementStore()
const { currentPage, pageSize, accountList, accountLoading, selectAccounts } =
  storeToRefs(accountManagement)

const switchAccount = async (userId: number, state: number) => {
  accountLoading.value = true

  const response =
    (await doSwitchAccount({
      account_id: userId
    })) ?? 'failed'

  accountLoading.value = false

  if (response.toString() === 'failed') return

  await accountManagement.getAccounts()
  ElMessage.success(`成功${state === 0 ? '启用' : '禁用'}`)
}

const updateAccount = async (userId: number) => {
  accountLoading.value = true

  const response =
    (await doUpdateAccount({
      account_id: userId
    })) ?? 'failed'

  accountLoading.value = false

  if (response.toString() === 'failed') return

  await accountManagement.getAccounts()
  ElMessage.success(`更新账户信息成功`)
}

const deleteAccount = async (userId: number) => {
  accountLoading.value = true

  const response =
    (await doDeleteAccount({
      account_id: userId
    })) ?? 'failed'

  accountLoading.value = false

  if (response.toString() === 'failed') return

  await accountManagement.getAccounts()
  ElMessage.success(`删除账户成功`)
}

const selectAccountsChange = (row: Account[]) => (selectAccounts.value = row)

const enableSelectAccounts = () => {
  selectAccounts.value.forEach((item: Account) => {
    if (item.switch === 1) return ElMessage.info(`编号:${item.id},已经启用了`)
    switchAccount(item.id, item.switch)
  })
}

const blockSelectAccounts = () => {
  selectAccounts.value.forEach((item: Account) => {
    if (item.switch === 0) return ElMessage.info(`编号:${item.id},已经禁用了`)
    switchAccount(item.id, item.switch)
  })
}

onMounted(accountManagement.getAccounts)
</script>

<style lang="scss" scoped>
.table {
  margin-top: 15px;
}
</style>
