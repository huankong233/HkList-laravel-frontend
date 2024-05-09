import axios from '@/utils/request.js'

export interface Ip {
  id: number
  ip: string
  mode: 0 | 1
  created_at: string
  updated_at: string
}

export interface getIp {
  current_page: number
  data: Ip[]
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

export interface addIp {
  ip: string
  mode: 0 | 1
}

export const addIp = (data: addIp) => axios.post<null>('/admin/ip', data)

export const getIp = (data: { page: number; size: number }) =>
  axios.get<getIp>(`/admin/ip?page=${data.page}&size=${data.size}`)

export const updateIp = (ip: Ip) => axios.patch<null>(`/admin/ip/${ip.id}`, ip)

export const deleteIp = (ip: Ip) => axios.delete<null>(`/admin/ip/${ip.id}`)

export const deleteIps = (ip_ids: number[]) => axios.delete<null>('/admin/ip', { data: { ip_ids } })
