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

export interface getFileList {
  url: string
  shorturl: string
  dir: string
  pwd: string
  password?: string
}

export interface fileList {
  uk: number
  shareid: number
  randsk: string
  list: file[]
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

export interface downloadFiles {
  uk: number
  shareid: number
  randsk: string
  fs_ids: number[]
  vcode_str?: string
  vcode_input?: string
}

export interface link {
  url: string
  filename: string
  ua: string
}

export type downloadLinks = link[]

export interface generateVocde {
  img: string
  vcode: string
}

export const getConfig = () => axios.get<config>('/parse/config')

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

export const downloadFiles = (data: downloadFiles) =>
  axios.post<downloadLinks>('/parse/download_files', data)

export const generateVcode = () => axios.get<generateVocde>(`/parse/generate_vcode`)
