import axios from '@/utils/request.js'

export interface config {
  version: string
  front_end_version: string
  sleep: number
  max_once: number
  password: string
  announce: string
  user_agent: string
  need_inv_code: boolean
  whitelist_mode: boolean
  show_copyright: boolean
  custom_copyright: string
  main_server: string
  code: string
  parse_mode: number
  max_filesize: number
  min_single_filesize: number
  max_single_filesize: number
  token_mode: boolean
  button_link: string
  limit_cn: boolean
  limit_prov: boolean
  debug: boolean
  name: string
  show_login_button: boolean
  token_bind_ip: boolean
  proxy_server: string
  proxy_password: string
}

export const getConfig = () => axios.get<config>('/admin/config/main')

export const updateConfig = (data: config) => axios.patch<null>('/admin/config/main', data)

export type testAuth =
  | {
      code: string
      expired_at: string
    }
  | { ip: string }

export const testAuth = (data: config) => axios.post<testAuth>('/admin/config/main/testAuth', data)
