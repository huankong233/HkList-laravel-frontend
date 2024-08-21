import axios from '@/utils/request.js'

export interface addAccount {
  type: 1 | 2 | 3
  cookie: string
}

export const addAccount = (data: addAccount) =>
  axios.post<{ have_repeat: boolean }>('/admin/account', data)

export interface Account {
  id: number
  baidu_name: string
  cookie: string
  access_token: string
  refresh_token: string
  cid: number
  vip_type: string
  switch: 0 | 1 | boolean
  reason: string | null
  prov: string | null
  today_size: null | number
  today_count: number
  total_size: null | number
  total_count: number
  svip_end_at: string
  last_use_at: string | null
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

export const getAccount = (data: { page: number; size: number }) =>
  axios.get<getAccount>(`/admin/account?page=${data.page}&size=${data.size}`)

export const updateAccount = (account: Account) =>
  axios.patch<null>(`/admin/account/${account.id}`, account)

export const updateAccountInfo = (account: Account) =>
  axios.patch<null>(`/admin/account/info`, { account_ids: [account.id] })

export const updateAccountsInfo = (account_ids: number[]) =>
  axios.patch<null>(`/admin/account/info`, { account_ids })

export const deleteAccount = (account: Account) =>
  axios.delete<null>(`/admin/account`, { data: { account_ids: [account.id] } })

export const deleteAccounts = (account_ids: number[]) =>
  axios.delete<null>('/admin/account', { data: { account_ids } })

export const switchAccount = (data: { account: Account; switch: 1 | 0 }) =>
  axios.patch<null>('/admin/account/switch', {
    account_ids: [data.account.id],
    switch: data.switch
  })

export const switchAccounts = (data: { account_ids: number[]; switch: 1 | 0 }) =>
  axios.patch<null>('/admin/account/switch', data)

export interface BanInfo {
  errno: number
  anti: {
    start_time: number
    end_time: number
    ban_status: boolean
    ban_reason: string
    ban_times: number
    ban_msg: string
    user_operate_type: number
  }
  errmsg: string
}

export const getAccountBanInfo = (account: Account) =>
  axios.get<BanInfo>(`/admin/account/ban?account_id=${account.id}`)

export const switchBanAccounts = () => axios.patch<null>(`/admin/account/ban`)
