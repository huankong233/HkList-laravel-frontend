import axios from '@/utils/request.js'

export const doInstall = params => axios.post('/doInstall', params)
