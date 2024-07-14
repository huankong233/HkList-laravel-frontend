import axios from '@/utils/request.js'

export interface Record {
  id: number
  ip: string
  fs_id: string
  url: string
  ua: string
  user_id: number
  token_id: number
  account_id: number
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface getRecord {
  current_page: number
  data: Record[]
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

export interface getRecordParams {
  page: number
  size: number
  orderBy: 'id' | 'size'
}

export const getRecord = (data: getRecordParams) =>
  axios.get<getRecord>(`/admin/record?page=${data.page}&size=${data.size}&orderBy=${data.orderBy}`)

export interface getRecordCount {
  today: {
    count: number
    size: number
  }
  total: {
    count: number
    size: number
  }
}

export const getRecordCount = () => axios.get<getRecordCount>(`/admin/record/count`)

export const deleteRecord = (record: Record) =>
  axios.delete<null>(`/admin/record`, { data: { record_ids: [record.id] } })

export const deleteRecords = (record_ids: number[]) =>
  axios.delete<null>('/admin/record', { data: { record_ids } })
