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
  <el-button type="primary" @click="switchBanAccounts()"> 启用被限速的账号 </el-button>

  <el-table
    v-loading="pending"
    :data="accountList?.data ?? []"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectAccountsChange"
  >
    <el-table-column type="selection" fixed width="40"></el-table-column>
    <el-table-column prop="id" label="ID" fixed=""></el-table-column>
    <el-table-column prop="baidu_name" label="百度用户名" width="150px">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.baidu_name }}</span>
        <el-input v-if="row.edit" v-model="row.baidu_name"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="today_size" label="今日解析" width="150px">
      <template #default="{ row }">
        <span>{{ row.today_count }} ({{ formatBytes(row.today_size ?? 0) }})</span>
      </template>
    </el-table-column>
    <el-table-column prop="today_size" label="总共解析" width="150px">
      <template #default="{ row }">
        <span>{{ row.total_count }} ({{ formatBytes(row.total_size ?? 0) }})</span>
      </template>
    </el-table-column>
    <el-table-column prop="account_type" label="账号类型" width="160px">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.account_type }}</span>
        <el-select v-if="row.edit" v-model="row.account_type">
          <el-option :key="item" :value="item" v-for="item in ['cookie', 'access_token']">
            {{ item }}
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="cookie" label="Cookie" width="150px">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.cookie }}</span>
        <el-input v-if="row.edit" v-model="row.cookie"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="access_token" label="access_token" width="150px">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.access_token }}</span>
        <el-input v-if="row.edit" v-model="row.access_token"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="refresh_token" label="refresh_token" width="150px">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.refresh_token }}</span>
        <el-input v-if="row.edit" v-model="row.refresh_token"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="expired_at" label="token过期时间" width="160px">
      <template #default="{ row }">
        {{ row.expired_at ? new Date(row.expired_at).toLocaleString() : '非token模式' }}
      </template>
    </el-table-column>
    <el-table-column prop="vip_type" label="会员类型" width="130px">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.vip_type }}</span>
        <el-select v-if="row.edit" v-model="row.vip_type">
          <el-option
            :key="item"
            :value="item"
            v-for="item in ['超级会员', '假超级会员', '普通会员', '普通用户']"
          >
            {{ item }}
          </el-option>
        </el-select>
      </template>
    </el-table-column>
    <el-table-column prop="switch" label="状态" width="70px">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.switch ? '启用' : '禁用' }}</span>
        <el-switch v-if="row.edit" v-model="row.switch"></el-switch>
      </template>
    </el-table-column>
    <el-table-column prop="prov" label="省份" width="120px">
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
    <el-table-column prop="reason" label="禁用原因" width="150px">
      <template #default="{ row }">
        <span v-if="!row.edit">{{ row.reason ?? '未禁用' }}</span>
        <el-input v-if="row.edit" v-model="row.reason"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="svip_end_at" label="超级会员结束时间" width="160px">
      <template #default="{ row }">
        {{ new Date(row.svip_end_at).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column prop="last_use_at" label="上次使用时间" width="160px">
      <template #default="{ row }">
        {{ new Date(row.last_use_at).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="创建时间" width="160px">
      <template #default="{ row }">
        {{ new Date(row.created_at).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column prop="updated_at" label="更新时间" width="160px">
      <template #default="{ row }">
        {{ new Date(row.updated_at).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column width="350" label="操作" fixed="right">
      <template #default="{ row }">
        <el-button
          size="small"
          type="primary"
          :disabled="row.id === 0"
          @click="updateAccountInfo(row)"
          >更新信息</el-button
        >
        <el-button
          size="small"
          type="primary"
          :disabled="row.id === 0"
          @click="checkAccountBanInfo(row)"
        >
          检查封禁状态
        </el-button>
        <el-button
          size="small"
          type="primary"
          :disabled="row.id === 0"
          v-if="!row.edit"
          @click="switchAccount(row)"
        >
          編輯
        </el-button>
        <el-button
          size="small"
          type="primary"
          :disabled="row.id === 0"
          v-if="row.edit"
          @click="switchAccount(row)"
        >
          完成
        </el-button>
        <el-button size="small" type="danger" :disabled="row.id === 0" @click="deleteAccount(row)"
          >删除</el-button
        >
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
    res.data.data = res.data.data.map((v) => {
      v.switch = v.switch ? true : false
      return v
    })
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

const switchBanAccounts = async () => {
  try {
    pending.value = true
    await AccountApi.switchBanAccounts()
    ElMessage.success('启用被限速账号成功')
  } finally {
    pending.value = false
    await getAccounts()
  }
}

const checkAccountBanInfo = async (account: AccountApi.Account) => {
  try {
    pending.value = true
    const res = await AccountApi.getAccountBanInfo(account)
    if (res.data.errno === 0) {
      const anti = res.data.anti
      ElMessage.success(`获取封禁信息成功`)
      if (anti.ban_status) {
        ElMessage.success(`封禁状态：已封禁`)
        ElMessage.success(
          `封禁开始时间: ${new Date(parseInt(`${anti.start_time}000`)).toLocaleString()}`
        )
        ElMessage.success(
          `封禁结束时间: ${new Date(parseInt(`${anti.end_time}000`)).toLocaleString()}`
        )
        ElMessage.success(`已被封禁${anti.ban_times}次`)
        ElMessage.success(`封禁原因: ${anti.ban_reason}`)
      } else {
        ElMessage.success(`封禁状态：未封禁`)
      }
    } else if (res.data.errno === -6) {
      ElMessage.warning(`获取封禁信息失败,Cookie或AccessToken已过期`)
    } else {
      ElMessage.warning(`获取封禁信息失败,code:${res.data.errno},msg:${res.data.errmsg}`)
    }
  } finally {
    pending.value = false
  }
}
</script>

<style lang="scss" scoped>
.table,
.el-pagination {
  margin-top: 15px;
}
</style>
