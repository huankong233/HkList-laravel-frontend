import type { response } from '@/utils/request.js'
import axios from '@/utils/request.js'
import { getPrefix } from '@/utils/env.js'

export const doLogin = (params: { username: string; password: string }): response =>
  axios.post(`${getPrefix()}/login`, params) as response
export const doLogout = (): response => axios.post(`${getPrefix()}/logout`)

export const doAddAccount = (params: { cookie: string }): response =>
  axios.post(`${getPrefix()}/addAccount`, params)
export const doGetAccountInfo = (params: { cookie: string; check?: boolean }): response =>
  axios.post(`${getPrefix()}/getAccountInfo`, params)

export const doGetAccounts = (params: { page?: number; size: number }): response =>
  axios.post(`${getPrefix()}/getAccounts?page=${params.page ?? 1}`, params)

export const doSwitchAccount = (params: { account_id: number }): response =>
  axios.post(`${getPrefix()}/switchAccount`, params)

export const doDeleteAccount = (params: { account_id: number }): response =>
  axios.post(`${getPrefix()}/deleteAccount`, params)

export const doUpdateAccount = (params: { account_id: number }): response =>
  axios.post(`${getPrefix()}/updateAccount`, params)

export const doGetConfig = (): response => axios.post(`${getPrefix()}/getConfig`)
export const doGetMailConfig = (): response => axios.post(`${getPrefix()}/getMailConfig`)
export const doChangeConfig = (params: {
  sleep: number
  maxOnce: number
  userAgent: string
  announce: string
  announceSwitch: boolean
  cookie: string
  debug: boolean
  ssl: boolean
  prefix: string
}): response => axios.post(`${getPrefix()}/changeConfig`, params)

export const doChangeMailConfig = (params: {
  mailSwitch: boolean
  mailTo: string
  mailHost: string
  mailPort: string
  mailUsername: string
  mailPassword: string
  mailFromAddress: string
}): response => axios.post(`${getPrefix()}/changeMailConfig`, params)

export const doSendTestMsg = (): response => axios.post(`${getPrefix()}/sendTestMsg`)

export const doChangeUserInfo = (params: {
  nowPassword: string
  newPassword: string
  confirmPassword: string
  newUsername?: string
}): response => axios.post(`${getPrefix()}/changeUserInfo`, params)
