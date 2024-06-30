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
  name: string
  code: string
  main_server: string
  show_copyright: boolean
  parse_mode: number
  custom_copyright: string
  max_filesize: number
  min_single_file: number
  token_mode: boolean
  button_link: string
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
  debug: boolean
  name: string
  main_server: string
  code: string
  show_copyright: boolean
  parse_mode: number
  max_filesize: number
  custom_copyright: string
  min_single_file: number
  token_mode: boolean
}

export const updateConfig = (data: updateConfig) => axios.patch<null>('/admin/config/main', data)

export type testAuth =
  | {
      code: string
      expired_at: string
    }
  | { ip: string }

export const testAuth = (data: updateConfig) =>
  axios.post<testAuth>('/admin/config/main/testAuth', data)
