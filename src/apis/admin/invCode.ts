import axios from '@/utils/request.js'

export interface InvCode {
  id: number
  name: string
  use_count: number
  can_count: string
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface getInvCode {
  current_page: number
  data: InvCode[]
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

export interface addInvCodeSingle {
  type: 'single'
  name: string
  can_count: number
  group_id: number
}

export interface addInvCodeRandom {
  type: 'random'
  can_count: number
  count: number
  group_id: number
}

export type addInvCode = addInvCodeSingle | addInvCodeRandom

export const addInvCodeSingle = (data: addInvCodeSingle) =>
  axios.post<null>('/admin/inv_code', data)

export const addInvCodeRandom = (data: addInvCodeRandom) =>
  axios.post<null>('/admin/inv_code/generate', data)

export const getInvCode = (data: { page: number; size: number }) =>
  axios.get<getInvCode>(`/admin/inv_code?page=${data.page}&size=${data.size}`)

export const updateInvCode = (invCode: InvCode) =>
  axios.patch<null>(`/admin/inv_code/${invCode.id}`, invCode)

export const deleteInvCode = (invCode: InvCode) =>
  axios.delete<null>(`/admin/inv_code`, { data: { inv_code_ids: [invCode.id] } })

export const deleteInvCodes = (inv_code_ids: number[]) =>
  axios.delete<null>('/admin/inv_code', { data: { inv_code_ids } })
