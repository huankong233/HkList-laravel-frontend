import axios from '@/utils/request.js'

export interface config {
  version: string
  sleep: number
  max_once: number
  password: string
  announce: string
  user_agent: string
  need_inv_code: boolean
  whitelist_mode: boolean
  debug: boolean
  front_end_version: string
}

export const getConfig = () => axios.get<config>('/admin/config/main')

export interface updateConfig {
  sleep: number
  max_once: number
  password: string
  announce: string
  user_agent: string
  need_inv_code: boolean
  whitelist_mode: boolean
}

export const updateConfig = (data: updateConfig) => axios.patch<null>('/admin/config/main', data)
