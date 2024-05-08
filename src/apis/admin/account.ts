import axios from '@/utils/request.js'

export interface Account {
  id: number
  baidu_name: string
  netdisk_name: string
  cookie: string
  vip_type: string
  switch: 0 | 1
  svip_end_at: string
  last_use_at: string
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface getAccount {
  current_page: number
  data: Account[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
}

export interface addAccount {
  cookie: string[]
}

export const addAccount = (data: addAccount) => axios.post('/admin/account', data)

export const getAccount = (data: { page: number; size: number }) =>
  axios.get<getAccount>(`/admin/account?page=${data.page}&size=${data.size}`)

export const updateAccount = (account: Account) => axios.patch(`/admin/account/${account.id}`)

export const updateAccounts = (account_ids: number[]) =>
  axios.patch(`/admin/account`, { account_ids })

export const deleteAccount = (account: Account) => axios.delete(`/admin/account/${account.id}`)

export const deleteAccounts = (account_ids: number[]) =>
  axios.delete('/admin/account', { data: { account_ids } })
