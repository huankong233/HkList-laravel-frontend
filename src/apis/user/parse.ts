import axios from '@/utils/request.js'
import { string2number } from '@/utils/string2number.js'

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

export interface getFileList {
  url: string
  surl: string
  dir: string
  pwd: string
  password?: string
}

export interface file {
  category: number
  fs_id: number
  isdir: number
  local_ctime: number
  local_mtime: number
  server_ctime: number
  server_mtime: number
  size: number
  md5: string
  path: string
  server_filename: string
  dlink: string
}

export interface fileList {
  uk: number
  shareid: number
  randsk: string
  list: file[]
}

export const getFileList = async (data: getFileList) => {
  const res = await axios.post<fileList>('/parse/get_file_list', data)
  res.data.list = res.data.list.map((file) => {
    file.category = string2number(file.category as number | string)
    file.fs_id = string2number(file.fs_id as number | string)
    file.isdir = string2number(file.isdir as number | string)
    file.local_ctime = string2number(file.local_ctime as number | string)
    file.local_mtime = string2number(file.local_mtime as number | string)
    file.server_ctime = string2number(file.local_mtime as number | string)
    file.server_mtime = string2number(file.local_mtime as number | string)
    file.size = string2number(file.size as number | string)
    return file
  })
  return res
}

export interface getSign {
  surl: string
  uk: number
  shareid: number
  password?: string
}

export interface sign {
  timestamp: number
  sign: string
}

export const getSign = (data: getSign) => axios.post<sign>('/parse/get_sign', data)

export interface getDownloadLinks {
  fs_ids: number[]
  randsk: string
  shareid: number
  uk: number
  sign: string
  timestamp: number
  password?: string
}

export interface link {
  url: string
  filename: string
  ua: string
}

export type downloadLinks = link[]

export const getDownloadLinks = (data: getDownloadLinks) =>
  axios.post<downloadLinks>('/parse/get_download_links', data)
