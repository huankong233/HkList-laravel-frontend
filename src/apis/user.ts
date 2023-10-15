import type { response } from '@/utils/request.js'
import axios from '@/utils/request.js'

export const doInstall = (params: {
  db_connection: string
  app_name: string
  app_url: string
  admin_route_prefix: string
  db_host: string
  db_port: string
  db_database: string
  db_username: string
  db_password: string
}) => axios.post('/doInstall', params)

export const doGetConfig = (): response => axios.post('/user/getConfig')

export const doGetFileList = (params: { url: string; password: string; dir: string }): response =>
  axios.post('/user/getFileList', params)
export const doGetSign = (params: { uk: number; shareid: number }): response =>
  axios.post('/user/getSign', params)

export const doDownloadFiles = (params: {
  fs_ids: string[]
  timestamp: number
  uk: number
  sign: string
  randsk: string
  shareid: number
}): response => axios.post('/user/downloadFiles', params)
