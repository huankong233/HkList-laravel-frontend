<template>
  <AddInvCode @getInvCodes="getInvCodes" v-model="isAddInvCode" />

  <el-button type="primary" @click="switchAddInvCode"> 添加邀请码 </el-button>
  <el-button type="danger" :disabled="selectInvCodes.length <= 0" @click="deleteSelectInvCodes">
    批量删除
  </el-button>

  <el-table
    v-loading="pending"
    :data="invCodeList?.data ?? []"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectInvCodeChange"
  >
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="ID"> </el-table-column>
    <el-table-column prop="name" label="邀请码名称">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.name }}</span>
        <el-input v-show="row.edit" v-model="row.name"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="can_count" label="可用次数">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.can_count }}</span>
        <el-input-number v-show="row.edit" v-model="row.can_count"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column prop="use_count" label="使用次数">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.use_count }}</span>
        <el-input-number v-show="row.edit" v-model="row.use_count"></el-input-number>
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
        <el-button size="small" type="danger" @click="deleteInvCode(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[15, 30, 50, 100]"
    :total="invCodeList?.total ?? 100"
    layout="sizes, prev, pager, next"
    @size-change="getInvCodes"
    @current-change="getInvCodes"
  />
</template>

<script lang="ts" setup>
import * as InvCodeApi from '@/apis/admin/invCode.js'
import AddInvCode from '@/components/AdminView/InvCode/AddInvCode.vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const pageSize = ref(15)
const currentPage = ref(1)
const invCodeList = ref<InvCodeApi.getInvCode>()
const selectInvCodes = ref<InvCodeApi.InvCode[]>([])

const getInvCodes = async () => {
  try {
    pending.value = true
    const res = await InvCodeApi.getInvCode({ page: currentPage.value, size: pageSize.value })
    invCodeList.value = res.data
  } finally {
    pending.value = false
  }
}

const turnOnEditMode = async (row: InvCodeApi.InvCode & { edit?: boolean }) => {
  row.edit = !(row.edit ?? false)
}

const turnOffEditMode = async (row: InvCodeApi.InvCode & { edit?: boolean }) => {
  row.edit = !(row.edit ?? true)
  await updateInvCode(row)
}

const updateInvCode = async (invCode: InvCodeApi.InvCode) => {
  try {
    pending.value = true
    await InvCodeApi.updateInvCode(invCode)
    ElMessage.success('修改邀请码成功')
  } finally {
    pending.value = false
    await getInvCodes()
  }
}

const deleteInvCode = async (invCode: InvCodeApi.InvCode) => {
  try {
    pending.value = true
    await InvCodeApi.deleteInvCode(invCode)
    ElMessage.success('删除邀请码成功')
  } finally {
    pending.value = false
    await getInvCodes()
  }
}

const deleteSelectInvCodes = async () => {
  try {
    pending.value = true
    const inv_code_ids = selectInvCodes.value.map(invCode => invCode.id)
    await InvCodeApi.deleteInvCodes(inv_code_ids)
    ElMessage.success('删除邀请码成功')
  } finally {
    pending.value = false
    await getInvCodes()
  }
}

const selectInvCodeChange = (row: InvCodeApi.InvCode[]) => (selectInvCodes.value = row)

onMounted(getInvCodes)

const isAddInvCode = ref(false)
const switchAddInvCode = () => (isAddInvCode.value = !isAddInvCode.value)
</script>

<style lang="scss" scoped>
.table,
.el-pagination {
  margin-top: 15px;
}
</style>
