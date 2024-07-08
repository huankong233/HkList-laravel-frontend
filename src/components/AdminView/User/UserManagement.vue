<template>
  <AddUser @getUsers="getUsers" v-model="isAddUser" />

  <el-button type="primary" @click="getUsers()">刷新列表</el-button>
  <el-button type="primary" @click="switchAddUser()">添加用户</el-button>
  <el-button type="danger" :disabled="selectUsers.length <= 0" @click="deleteSelectUsers()">
    批量删除
  </el-button>

  <el-table
    v-loading="pending"
    :data="userList?.data ?? []"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectUsersChange"
  >
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="group.id" label="用户组ID"></el-table-column>
    <el-table-column prop="inv_code_id" label="邀请码ID">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.inv_code_id }}</span>
        <el-input-number v-show="row.edit" v-model="row.inv_code_id"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column prop="username" label="用户名">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.username }}</span>
        <el-input v-show="row.edit" v-model="row.username"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="password" label="密码">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.password }}</span>
        <el-input v-show="row.edit" v-model="row.password"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="role" label="权限">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.role }}</span>
        <el-select v-show="row.edit" v-model="row.role">
          <el-option v-for="item in ['user', 'admin']" :key="item" :label="item" :value="item" />
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
        <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[15, 50, 100, 500, userList?.total ?? 100]"
    :total="userList?.total ?? 100"
    layout="sizes, prev, pager, next"
    @size-change="getUsers"
    @current-change="getUsers"
  />
</template>

<script lang="ts" setup>
import * as UserApi from '@/apis/admin/user.js'
import AddUser from '@/components/AdminView/User/AddUser.vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const pageSize = ref(15)
const currentPage = ref(1)
const userList = ref<UserApi.getUser>()
const selectUsers = ref<UserApi.User[]>([])

const getUsers = async () => {
  try {
    pending.value = true
    const res = await UserApi.getUser({ page: currentPage.value, size: pageSize.value })
    userList.value = res.data
  } finally {
    pending.value = false
  }
}

const turnOnEditMode = async (row: UserApi.User & { edit?: boolean }) => {
  row.edit = !(row.edit ?? false)
}

const turnOffEditMode = async (row: UserApi.User & { edit?: boolean }) => {
  row.edit = !(row.edit ?? true)
  await updateUser(row)
}

const updateUser = async (user: UserApi.User) => {
  try {
    pending.value = true
    await UserApi.updateUser(user)
    ElMessage.success('修改用户成功')
  } finally {
    pending.value = false
    await getUsers()
  }
}

const deleteUser = async (user: UserApi.User) => {
  try {
    pending.value = true
    await UserApi.deleteUser(user)
    ElMessage.success('删除用户成功')
  } finally {
    pending.value = false
    await getUsers()
  }
}

const deleteSelectUsers = async () => {
  try {
    pending.value = true
    const user_ids = selectUsers.value.map((user) => user.id)
    await UserApi.deleteUsers(user_ids)
    ElMessage.success('批量删除用户成功')
  } finally {
    pending.value = false
    await getUsers()
  }
}

const selectUsersChange = (row: UserApi.User[]) => (selectUsers.value = row)

onMounted(getUsers)

const isAddUser = ref(false)
const switchAddUser = () => (isAddUser.value = !isAddUser.value)
</script>

<style lang="scss" scoped>
.table,
.el-pagination {
  margin-top: 15px;
}
</style>
