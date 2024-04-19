import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { doGetAccounts } from '@/apis/admin.js'
import type { _response } from '@/utils/request.js'
import type { StoreDefinition } from 'pinia'

export interface Account {
  add_time: string
  baidu_name: string
  cookie: string
  id: number
  netdisk_name: string
  state: string
  switch: number
  use: string
  vip_type: string
}

export const useAccountManagementStore: StoreDefinition = defineStore('AccountManagement', () => {
  const addAccountFormVisible = ref(false)

  const addAccountForm = ref({
    cookie: '',
    username: '',
    vipType: '',
    checkedInfo: false,
    checkPending: false,
    addPending: false
  })

  const addAccountFormRef = ref<FormInstance | null>(null)

  const openAddDialog = () => {
    closeAddDialog()
    addAccountFormVisible.value = true
  }

  const closeAddDialog = () => {
    addAccountFormVisible.value = false
    addAccountForm.value.cookie = ''
    addAccountForm.value.username = ''
    addAccountForm.value.vipType = ''
    addAccountForm.value.checkedInfo = false
  }

  const currentPage = ref(1)
  const pageSize = ref(10)
  const accountList = ref({
    data: [] as Account[],
    total: 0
  })
  const accountLoading = ref(false)

  const selectAccounts = ref<Account[]>([])

  const getAccounts = async (loading = true) => {
    if (loading) accountLoading.value = true

    const response =
      (await doGetAccounts({
        page: currentPage.value,
        size: pageSize.value
      })) ?? 'failed'

    if (loading) accountLoading.value = false

    if (response.toString() === 'failed') return

    const { data } = response as _response
    accountList.value = data
  }

  return {
    addAccountFormVisible,
    addAccountForm,
    addAccountFormRef,
    openAddDialog,
    closeAddDialog,
    currentPage,
    pageSize,
    accountList,
    accountLoading,
    selectAccounts,
    getAccounts
  }
})
