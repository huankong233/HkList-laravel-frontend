<template>
  <AddIp @getIps="getIps" v-model="isAddIp" />

  <el-button type="primary" @click="getIps()">刷新列表</el-button>
  <el-button type="primary" @click="switchAddIp()">添加IP</el-button>
  <el-button type="danger" :disabled="selectIps.length <= 0" @click="deleteSelectIps()">
    批量删除
  </el-button>

  <el-table
    v-loading="pending"
    :data="ipList?.data ?? []"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectIpsChange"
  >
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="ip" label="IP">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.ip }}</span>
        <el-input v-show="row.edit" v-model="row.ip"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="mode" label="模式">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.mode ? '白名单' : '黑名单' }}</span>
        <el-select v-show="row.edit" v-model="row.mode">
          <el-option
            v-for="(item, index) in ['黑名单', '白名单']"
            :key="index"
            :label="item"
            :value="index"
          />
        </el-select>
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
    <el-table-column width="150" label="操作" fixed="right">
      <template #default="{ row }">
        <el-button size="small" type="primary" @click="turnOnEditMode(row)" v-if="!row.edit">
          编辑
        </el-button>
        <el-button size="small" type="primary" @click="turnOffEditMode(row)" v-if="row.edit">
          保存
        </el-button>
        <el-button size="small" type="danger" @click="deleteIp(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[15, 50, 100, 500, ipList?.total ?? 100]"
    :total="ipList?.total ?? 100"
    layout="sizes, prev, pager, next"
    @size-change="getIps"
    @current-change="getIps"
  />
</template>

<script lang="ts" setup>
import * as IpApi from '@/apis/admin/ip.js'
import AddIp from '@/components/AdminView/Ip/AddIp.vue'
import { isValidIp } from '@/utils/ip.js'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const pageSize = ref(15)
const currentPage = ref(1)
const ipList = ref<IpApi.getIp>()
const selectIps = ref<IpApi.Ip[]>([])

const getIps = async () => {
  try {
    pending.value = true
    const res = await IpApi.getIp({ page: currentPage.value, size: pageSize.value })
    ipList.value = res.data
  } finally {
    pending.value = false
  }
}

const turnOnEditMode = async (row: IpApi.Ip & { edit?: boolean }) => {
  row.edit = !(row.edit ?? false)
}

const turnOffEditMode = async (row: IpApi.Ip & { edit?: boolean }) => {
  if (!isValidIp(row.ip)) return ElMessage.error('请输入正确的IP')

  row.edit = !(row.edit ?? true)
  await updateIp(row)
}

const updateIp = async (Ip: IpApi.Ip) => {
  try {
    pending.value = true
    await IpApi.updateIp(Ip)
    ElMessage.success('修改IP成功')
  } finally {
    pending.value = false
    await getIps()
  }
}

const deleteIp = async (Ip: IpApi.Ip) => {
  try {
    pending.value = true
    await IpApi.deleteIp(Ip)
    ElMessage.success('删除IP成功')
  } finally {
    pending.value = false
    await getIps()
  }
}

const deleteSelectIps = async () => {
  try {
    pending.value = true
    const Ip_ids = selectIps.value.map((Ip) => Ip.id)
    await IpApi.deleteIps(Ip_ids)
    ElMessage.success('批量删除IP成功')
  } finally {
    pending.value = false
    await getIps()
  }
}

const selectIpsChange = (row: IpApi.Ip[]) => (selectIps.value = row)

onMounted(getIps)

const isAddIp = ref(false)
const switchAddIp = () => (isAddIp.value = !isAddIp.value)
</script>

<style lang="scss" scoped>
.table,
.el-pagination {
  margin-top: 15px;
}
</style>
