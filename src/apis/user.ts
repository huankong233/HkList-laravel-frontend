import type { response } from '@/utils/request.js'
import axios from '@/utils/request.js'

export const doInstall = params => axios.post('/doInstall', params)

export const doGetConfig = (): response => axios.post('/user/getConfig')
