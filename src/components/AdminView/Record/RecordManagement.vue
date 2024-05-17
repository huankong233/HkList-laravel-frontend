<template>
  <el-button type="primary" @click="getRecords()">刷新列表</el-button>
  <el-button type="danger" :disabled="selectRecords.length <= 0" @click="deleteSelectRecords()">
    批量删除
  </el-button>

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
    <el-table-column prop="filename" label="文件名"></el-table-column>
    <el-table-column prop="size" label="文件大小"></el-table-column>
    <el-table-column prop="url" label="下载链接"></el-table-column>
    <el-table-column prop="ua" label="UA"></el-table-column>
    <el-table-column prop="user_id" label="用户ID"></el-table-column>
    <el-table-column prop="normal_account_id" label="dlink账号ID"></el-table-column>
    <el-table-column prop="account_id" label="reallink账号ID"></el-table-column>
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
    layout="sizes, prev, pager, next"
    @size-change="getRecords"
    @current-change="getRecords"
  />
</template>

<script lang="ts" setup>
import * as RecordApi from '@/apis/admin/record.js'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const pageSize = ref(15)
const currentPage = ref(1)
const RecordList = ref<RecordApi.getRecord>()
const selectRecords = ref<RecordApi.Record[]>([])

const getRecords = async () => {
  try {
    pending.value = true
    const res = await RecordApi.getRecord({ page: currentPage.value, size: pageSize.value })
    RecordList.value = res.data
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
