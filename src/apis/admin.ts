import type { response } from '@/utils/request.js'
import axios from '@/utils/request.js'
import { getPrefix } from '@/utils/env.js'

export const doLogin = (params): response => axios.post(`${getPrefix()}/login`, params) as response
export const doLogout = (): response => axios.post(`${getPrefix()}/logout`)

export const doAddAccount = (params): response => axios.post(`${getPrefix()}/addAccount`, params)
export const doGetAccountInfo = (params): response =>
  axios.post(`${getPrefix()}/getAccountInfo`, params)

export const doGetAccounts = (params): response =>
  axios.post(`${getPrefix()}/getAccounts?page=${params.page ?? 1}`, params)

export const doSwitchAccount = (params): response =>
  axios.post(`${getPrefix()}/switchAccount`, params)

export const doDeleteAccount = (params): response =>
  axios.post(`${getPrefix()}/deleteAccount`, params)

export const doGetConfig = (): response => axios.post(`${getPrefix()}/getConfig`)
export const doChangeConfig = (params): response =>
  axios.post(`${getPrefix()}/changeConfig`, params)

export const doChangeUserInfo = (params): response =>
  axios.post(`${getPrefix()}/changeUserInfo`, params)
