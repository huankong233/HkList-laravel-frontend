<template>
  <AddGroup @getGroups="getGroups" v-model="isAddGroup" />

  <el-button type="primary" @click="switchAddGroup"> 添加用户组 </el-button>
  <el-button type="danger" :disabled="selectGroups.length <= 0" @click="deleteSelectGroups">
    批量删除
  </el-button>

  <el-table
    v-loading="pending"
    :data="GroupList?.data ?? []"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectGroupsChange"
  >
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="ID"> </el-table-column>
    <el-table-column prop="name" label="组名">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.name }}</span>
        <el-input v-show="row.edit" v-model="row.name"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="count" label="可解析次数">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.count }}</span>
        <el-input-number v-show="row.edit" v-model="row.count"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="可解析大小">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.size }}</span>
        <el-input-number v-show="row.edit" v-model="row.size"></el-input-number>
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
        <el-button size="small" type="danger" @click="deleteGroup(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[15, 30, 50, 100]"
    :total="GroupList?.total ?? 100"
    layout="sizes, prev, pager, next"
    @size-change="getGroups"
    @current-change="getGroups"
  />
</template>

<script lang="ts" setup>
import * as GroupApi from '@/apis/admin/group.js'
import AddGroup from '@/components/AdminView/Group/AddGroup.vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const pageSize = ref(15)
const currentPage = ref(1)
const GroupList = ref<GroupApi.getGroup>()
const selectGroups = ref<GroupApi.Group[]>([])

const getGroups = async () => {
  try {
    pending.value = true
    const res = await GroupApi.getGroup({ page: currentPage.value, size: pageSize.value })
    GroupList.value = res.data
  } finally {
    pending.value = false
  }
}

const turnOnEditMode = async (row: GroupApi.Group & { edit?: boolean }) => {
  row.edit = !(row.edit ?? false)
}

const turnOffEditMode = async (row: GroupApi.Group & { edit?: boolean }) => {
  row.edit = !(row.edit ?? true)
  await updateGroup(row)
}

const updateGroup = async (Group: GroupApi.Group) => {
  try {
    pending.value = true
    await GroupApi.updateGroup(Group)
    ElMessage.success('修改用户组成功')
  } finally {
    pending.value = false
    await getGroups()
  }
}

const deleteGroup = async (Group: GroupApi.Group) => {
  try {
    pending.value = true
    await GroupApi.deleteGroup(Group)
    ElMessage.success('删除用户组成功')
  } finally {
    pending.value = false
    await getGroups()
  }
}

const deleteSelectGroups = async () => {
  try {
    pending.value = true
    const Group_ids = selectGroups.value.map(Group => Group.id)
    await GroupApi.deleteGroups(Group_ids)
    ElMessage.success('批量删除用户组成功')
  } finally {
    pending.value = false
    await getGroups()
  }
}

const selectGroupsChange = (row: GroupApi.Group[]) => (selectGroups.value = row)

onMounted(getGroups)

const isAddGroup = ref(false)
const switchAddGroup = () => (isAddGroup.value = !isAddGroup.value)
</script>

<style lang="scss" scoped>
.table,
.el-pagination {
  margin-top: 15px;
}
</style>
