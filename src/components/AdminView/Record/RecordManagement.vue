<template>
  <el-button type="primary" @click="getRecords()">刷新列表</el-button>
  <el-button type="danger" :disabled="selectRecords.length <= 0" @click="deleteSelectRecords()">
    批量删除
  </el-button>

  <el-text style="margin-left: 20px">
    累计解析: {{ recordCount.total.count }} ({{ formatBytes(recordCount.total.size ?? 0) }})
  </el-text>
  <el-text>
    今日解析: {{ recordCount.today.count }} ({{ formatBytes(recordCount.today.size ?? 0) }})
  </el-text>

  <el-text style="margin-left: 20px">
    按照
    <el-select v-model="orderBy" @change="getRecords" style="width: 100px">
      <el-option key="id" label="时间" value="id" />
      <el-option key="size" label="文件大小" value="size" />
    </el-select>
    排序
  </el-text>

  <el-table
    v-loading="pending"
    :data="RecordList?.data ?? []"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectRecordChange"
  >
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="ip" label="IP"></el-table-column>
    <el-table-column prop="fs_id" label="文件ID"></el-table-column>
    <el-table-column prop="file.filename" label="文件名"></el-table-column>
    <el-table-column prop="fs_id" label="文件大小">
      <template #default="{ row }">
        <span>{{ formatBytes(row.file.size) }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="url" label="下载链接"></el-table-column>
    <el-table-column prop="ua" label="UA"></el-table-column>
    <el-table-column prop="user_id" label="用户ID">
      <template #default="{ row }">
        {{ row.user_id ?? '非用戶解析' }}
      </template>
    </el-table-column>
    <el-table-column prop="token_id" label="卡密ID">
      <template #default="{ row }">
        {{ row.token_id ?? '非卡密解析' }}
      </template>
    </el-table-column>
    <el-table-column prop="account_id" label="解析账号ID"></el-table-column>
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
        <el-button size="small" type="danger" @click="deleteRecord(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[15, 50, 100, 500, RecordList?.total ?? 100]"
    :total="RecordList?.total ?? 100"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="getRecords"
    @current-change="getRecords"
  />
</template>

<script lang="ts" setup>
import * as RecordApi from '@/apis/admin/record.js'
import { formatBytes } from '@/utils/format.js'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const pageSize = ref(15)
const currentPage = ref(1)
const orderBy = ref<RecordApi.getRecordParams['orderBy']>('id')
const RecordList = ref<RecordApi.getRecord>()
const selectRecords = ref<RecordApi.Record[]>([])
const recordCount = ref<RecordApi.getRecordCount>({
  today: { count: 0, size: 0 },
  total: { count: 0, size: 0 }
})

const getRecords = async () => {
  try {
    pending.value = true
    const res = await RecordApi.getRecord({
      page: currentPage.value,
      size: pageSize.value,
      orderBy: orderBy.value
    })
    RecordList.value = res.data
  } finally {
    pending.value = false
    await getRecordCount()
  }
}

const getRecordCount = async () => {
  try {
    pending.value = true
    const res = await RecordApi.getRecordCount()
    recordCount.value = res.data
  } finally {
    pending.value = false
  }
}

const deleteRecord = async (Record: RecordApi.Record) => {
  try {
    pending.value = true
    await RecordApi.deleteRecord(Record)
    ElMessage.success('删除记录成功')
  } finally {
    pending.value = false
    await getRecords()
  }
}

const deleteSelectRecords = async () => {
  try {
    pending.value = true
    const record_ids = selectRecords.value.map((record) => record.id)
    await RecordApi.deleteRecords(record_ids)
    ElMessage.success('删除记录成功')
  } finally {
    pending.value = false
    await getRecords()
  }
}

const selectRecordChange = (row: RecordApi.Record[]) => (selectRecords.value = row)

onMounted(getRecords)
</script>

<style lang="scss" scoped>
.table,
.el-pagination {
  margin-top: 15px;
}
</style>
