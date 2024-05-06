import axios from '@/utils/request.js'

export interface config {
  announce: string
  user_agent: string
  debug: boolean
  max_once: number
  have_account: boolean
  have_login: boolean
  need_inv_code: boolean
  need_password: boolean
}

export const getConfig = () => axios.get<config>('/parse/config')
