import type { response } from '@/utils/request.js'
import axios from '@/utils/request.js'

export const doInstall = params => axios.post('/doInstall', params)

export const doGetConfig = (): response => axios.post('/user/getConfig')

export const doGetFileList = (params): response => axios.post('/user/getFileList', params)
export const doGetSign = (params): response => axios.post('/user/getSign', params)

export const doDownloadFiles = (params): response => axios.post('/user/downloadFiles', params)
