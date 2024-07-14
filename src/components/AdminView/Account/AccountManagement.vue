<template>
  <AddAccount @getAccounts="getAccounts" v-model="isAddAccount" />

  <el-button type="primary" @click="getAccounts()">刷新列表</el-button>
  <el-button type="primary" @click="switchAddAccount()">添加账号</el-button>
  <el-button type="primary" :disabled="selectAccounts.length <= 0" @click="updateSelectAccounts()">
    批量更新信息
  </el-button>
  <el-button type="primary" :disabled="selectAccounts.length <= 0" @click="enableSelectAccounts()">
    批量启用
  </el-button>
  <el-button type="primary" :disabled="selectAccounts.length <= 0" @click="disableSelectAccounts()">
    批量禁用
  </el-button>
  <el-button type="danger" :disabled="selectAccounts.length <= 0" @click="deleteSelectAccounts()">
    批量删除
  </el-button>

  <el-table
    v-loading="pending"
    :data="accountList?.data ?? []"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectAccountsChange"
  >
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="baidu_name" label="百度用户名"></el-table-column>
    <el-table-column prop="today_size" label="今日解析">
      <template #default="{ row }">
        <span>{{ row.today_count }} ({{ formatBytes(row.today_size ?? 0) }})</span>
      </template>
    </el-table-column>
    <el-table-column prop="today_size" label="縂共解析">
      <template #default="{ row }">
        <span>{{ row.total_count }} ({{ formatBytes(row.total_size ?? 0) }})</span>
      </template>
    </el-table-column>
    <el-table-column prop="cookie" label="Cookie"></el-table-column>
    <el-table-column prop="vip_type" label="会员类型"></el-table-column>
    <el-table-column prop="switch" label="状态">
      <template #default="{ row }">
        <span>{{ row.switch ? '启用' : '禁用' }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="prov" label="省份">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.prov ?? '未使用' }}</span>
        <el-select v-if="row.edit" v-model="row.prov">
          <el-option :key="null" :value="null">未使用</el-option>
          <el-option
            v-for="item in [
              '北京市',
              '天津市',
              '上海市',
              '重庆市',
              '河北省',
              '山西省',
              '内蒙古自治区',
              '辽宁省',
              '吉林省',
              '黑龙江省',
              '江苏省',
              '浙江省',
              '安徽省',
              '福建省',
              '江西省',
              '山东省',
              '河南省',
              '湖北省',
              '湖南省',
              '广东省',
              '广西壮族自治区',
              '海南省',
              '四川省',
              '贵州省',
              '云南省',
              '西藏自治区',
              '陕西省',
              '甘肃省',
              '青海省',
              '宁夏回族自治区',
              '新疆维吾尔自治区',
              '香港特别行政区',
              '澳门特别行政区',
              '台湾省'
            ]"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="reason" label="禁用原因">
      <template #default="{ row }">
        {{ row.reason ?? '未禁用' }}
      </template>
    </el-table-column>
    <el-table-column prop="svip_end_at" label="超级会员结束时间">
      <template #default="{ row }">
        {{ new Date(row.svip_end_at).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column prop="last_use_at" label="上次使用时间">
      <template #default="{ row }">
        {{ new Date(row.last_use_at).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="创建时间">
      <template #default="{ row }">
        {{ new Date(row.created_at).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column prop="updated_at" label="更新时间">
      <template #default="{ row }">
        {{ new Date(row.updated_at).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column width="300" label="操作" fixed="right">
      <template #default="{ row }">
        <el-button size="small" type="primary" @click="updateAccountInfo(row)">更新信息</el-button>
        <el-button size="small" type="primary" @click="enableAccount(row)" v-if="row.switch === 0">
          启用
        </el-button>
        <el-button size="small" type="primary" @click="disableAccount(row)" v-else>禁用</el-button>
        <el-button size="small" type="primary" v-if="!row.edit" @click="switchAccount(row)">
          編輯
        </el-button>
        <el-button size="small" type="primary" v-if="row.edit" @click="switchAccount(row)">
          完成
        </el-button>
        <el-button size="small" type="danger" @click="deleteAccount(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[15, 50, 100, 500, accountList?.total ?? 100]"
    :total="accountList?.total ?? 100"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="getAccounts"
    @current-change="getAccounts"
  />
</template>

<script lang="ts" setup>
import * as AccountApi from '@/apis/admin/account.js'
import AddAccount from '@/components/AdminView/Account/AddAccount.vue'
import { formatBytes } from '@/utils/format.js'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const pageSize = ref(15)
const currentPage = ref(1)
const accountList = ref<AccountApi.getAccount>()
const selectAccounts = ref<AccountApi.Account[]>([])

const getAccounts = async () => {
  try {
    pending.value = true
    const res = await AccountApi.getAccount({ page: currentPage.value, size: pageSize.value })
    accountList.value = res.data
  } finally {
    pending.value = false
  }
}

const updateAccountInfo = async (Account: AccountApi.Account) => {
  try {
    pending.value = true
    await AccountApi.updateAccountInfo(Account)
    ElMessage.success('更新账户信息成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const updateSelectAccounts = async () => {
  try {
    pending.value = true
    const Account_ids = selectAccounts.value.map((account) => account.id)
    await AccountApi.updateAccountsInfo(Account_ids)
    ElMessage.success('批量更新账户成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const deleteAccount = async (Account: AccountApi.Account) => {
  try {
    pending.value = true
    await AccountApi.deleteAccount(Account)
    ElMessage.success('删除账户成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const deleteSelectAccounts = async () => {
  try {
    pending.value = true
    const Account_ids = selectAccounts.value.map((account) => account.id)
    await AccountApi.deleteAccounts(Account_ids)
    ElMessage.success('批量删除账户成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const enableAccount = async (Account: AccountApi.Account) => {
  try {
    pending.value = true
    await AccountApi.switchAccount({
      account: Account,
      switch: 1
    })
    ElMessage.success('启用账户成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const disableAccount = async (Account: AccountApi.Account) => {
  try {
    pending.value = true
    await AccountApi.switchAccount({
      account: Account,
      switch: 0
    })
    ElMessage.success('禁用账户成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const enableSelectAccounts = async () => {
  try {
    pending.value = true
    const Account_ids = selectAccounts.value.map((account) => account.id)
    await AccountApi.switchAccounts({
      account_ids: Account_ids,
      switch: 1
    })
    ElMessage.success('批量启用账户成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const disableSelectAccounts = async () => {
  try {
    pending.value = true
    const Account_ids = selectAccounts.value.map((account) => account.id)
    await AccountApi.switchAccounts({
      account_ids: Account_ids,
      switch: 0
    })
    ElMessage.success('批量禁用账户成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const selectAccountsChange = (row: AccountApi.Account[]) => (selectAccounts.value = row)

onMounted(getAccounts)

const isAddAccount = ref(false)
const switchAddAccount = () => (isAddAccount.value = !isAddAccount.value)

const switchAccount = async (row: any) => {
  row.edit = !row.edit
  if (row.edit === false) {
    try {
      pending.value = true
      await AccountApi.updateAccount(row)
      ElMessage.success('修改賬號成功')
    } finally {
      pending.value = false
      await getAccounts()
    }
  }
}
</script>

<style lang="scss" scoped>
.table,
.el-pagination {
  margin-top: 15px;
}
</style>
