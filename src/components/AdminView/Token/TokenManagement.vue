<template>
  <AddToken @getTokens="getTokens" v-model="isAddToken" />

  <el-button type="primary" @click="getTokens()">刷新列表</el-button>
  <el-button type="primary" @click="switchAddToken()">添加卡密</el-button>
  <el-button type="primary" :disabled="selectTokens.length <= 0" @click="copyTokens()">
    批量复制
  </el-button>
  <el-button type="primary" :disabled="selectTokens.length <= 0" @click="copyTokens(false)">
    批量复制(无格式)
  </el-button>
  <el-button type="danger" :disabled="selectTokens.length <= 0" @click="deleteSelectTokens()">
    批量删除
  </el-button>

  <el-table
    v-loading="pending"
    :data="tokenList?.data ?? []"
    border
    show-overflow-tooltip
    class="table"
    @selection-change="selectTokenChange"
  >
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="ID"></el-table-column>
    <el-table-column prop="name" label="卡密名称">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.name }}</span>
        <el-input v-show="row.edit" v-model="row.name"></el-input>
      </template>
    </el-table-column>
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
    <el-table-column prop="count" label="可用次数">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.count }}</span>
        <el-input-number v-show="row.edit" v-model="row.count"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="可下载大小">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.size }}</span>
        <el-input-number v-show="row.edit" v-model="row.size"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column prop="day" label="有效期">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.day }}</span>
        <el-input-number v-show="row.edit" v-model="row.day"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column prop="expired_at" label="到期时间" width="250">
      <template #default="{ row }">
        <span v-show="!row.edit">
          {{
            row.expired_at
              ? `${new Date(row.expired_at).getTime() < Date.now() ? '(已过期) ' : ''}${new Date(row.expired_at).toLocaleString()}`
              : '未使用'
          }}
        </span>
        <el-date-picker
          v-if="row.edit"
          v-model="row.expired_at"
          type="datetime"
          placeholder="请选择日期"
        />
      </template>
    </el-table-column>
    <el-table-column prop="ip" label="ip">
      <template #default="{ row }">
        <span v-show="!row.edit">{{ row.ip ?? '未绑定ip' }}</span>
        <el-input v-show="row.edit" v-model="row.ip"></el-input>
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
    <el-table-column width="200" label="操作" fixed="right">
      <template #default="{ row }">
        <el-button size="small" type="primary" @click="turnOnEditMode(row)" v-if="!row.edit">
          编辑
        </el-button>
        <el-button size="small" type="primary" @click="turnOffEditMode(row)" v-if="row.edit">
          保存
        </el-button>
        <el-button size="small" type="primary" @click="copy(row.name)">复制</el-button>
        <el-button size="small" type="danger" @click="deleteToken(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[15, 50, 100, 500, tokenList?.total ?? 100]"
    :total="tokenList?.total ?? 100"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="getTokens"
    @current-change="getTokens"
  />
</template>

<script lang="ts" setup>
import * as TokenApi from '@/apis/admin/token.js'
import AddToken from '@/components/AdminView/Token/AddToken.vue'
import { copy } from '@/utils/copy.js'
import { formatBytes } from '@/utils/format.js'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

const pending = ref(false)

const pageSize = ref(15)
const currentPage = ref(1)
const tokenList = ref<TokenApi.getToken>()
const selectTokens = ref<TokenApi.Token[]>([])

const getTokens = async () => {
  try {
    pending.value = true
    const res = await TokenApi.getToken({ page: currentPage.value, size: pageSize.value })
    tokenList.value = res.data
  } finally {
    pending.value = false
  }
}

const turnOnEditMode = async (row: TokenApi.Token & { edit?: boolean }) => {
  row.edit = !(row.edit ?? false)
}

const turnOffEditMode = async (row: TokenApi.Token & { edit?: boolean }) => {
  row.edit = !(row.edit ?? true)
  await updateToken(row)
}

const updateToken = async (Token: TokenApi.Token) => {
  try {
    pending.value = true
    await TokenApi.updateToken(Token)
    ElMessage.success('修改卡密成功')
  } finally {
    pending.value = false
    await getTokens()
  }
}

const deleteToken = async (Token: TokenApi.Token) => {
  try {
    pending.value = true
    await TokenApi.deleteToken(Token)
    ElMessage.success('删除卡密成功')
  } finally {
    pending.value = false
    await getTokens()
  }
}

const deleteSelectTokens = async () => {
  try {
    pending.value = true
    const inv_code_ids = selectTokens.value.map((Token) => Token.id)
    await TokenApi.deleteTokens(inv_code_ids)
    ElMessage.success('删除卡密成功')
  } finally {
    pending.value = false
    await getTokens()
  }
}

const selectTokenChange = (row: TokenApi.Token[]) => (selectTokens.value = row)

onMounted(getTokens)

const isAddToken = ref(false)
const switchAddToken = () => (isAddToken.value = !isAddToken.value)

const copyTokens = (format = true) => {
  if (!format) {
    copy(selectTokens.value.map((v) => v.name).join('\n'))
    return
  }

  const text = selectTokens.value.map((token) =>
    [token.name, token.count, token.size, token.day].join(' | ')
  )
  text.unshift(['卡密', '可用次数', '可下载量', '可用天数'].join(' | '))
  copy(text.join('\n'))
}
</script>

<style lang="scss" scoped>
.table,
.el-pagination {
  margin-top: 15px;
}
</style>
