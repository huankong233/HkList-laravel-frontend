import axios from '@/utils/request.js'
import { string2number } from '@/utils/string2number.js'

export interface config {
  show_announce: boolean
  announce: string
  user_agent: string
  debug: boolean
  max_once: number
  have_account: boolean
  have_login: boolean
  need_inv_code: boolean
  need_password: boolean
  show_copyright: boolean
  custom_copyright: string
  min_single_file: number
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

export interface getVcode {
  password?: string
}

export interface vcode {
  vcode: string
  img: string
}

export const getVcode = (data: getVcode) => axios.post<vcode>('/parse/get_vcode', data)

export interface getDownloadLinks {
  fs_ids: number[]
  randsk: string
  shareid: number
  uk: number
  password?: string
  url: string

  vcode_str?: string
  vcode_input?: string

  surl: string
  dir: string
  pwd: string
}

export interface link {
  url: string
  urls?: string[]
  index: number
  filename: string
  fs_id: number
}

export type downloadLinks = link[]

export const getDownloadLinks = (data: getDownloadLinks) =>
  axios.post<downloadLinks>('/parse/get_download_links', data)

export interface limit {
  group_name: string
  count: number
  size: number
}

export const getLimit = () => axios.get<limit>('/parse/limit')
