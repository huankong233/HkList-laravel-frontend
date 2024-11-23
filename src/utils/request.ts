import { setLoginRole, setLoginState } from '@/utils/env.js'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// @ts-ignore
import func from './param.js'

const instance = axios.create({
  baseURL: '/api',
  timeout: Infinity,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  if (!config.data) config.data = {}
  if (!config.params) config.params = {}
  if (config.url) {
    const urlParams = new URLSearchParams(config.url.split('?')[1])
    config.params = {
      ...config.params,
      ...Object.fromEntries(urlParams)
    }
  }
  return func(config)
})

// http response 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response.data?.message

    if (message) {
      if (message === '用户未登陆') {
        ElMessage.error('登陆已过期, 请重新登陆!')
        setLoginState('0')
        setTimeout(() => (location.href = '/login'), 1000)
      } else if (message === 'Too Many Attempts.') {
        ElMessage.error('请求量过大! 请等待10分钟后重试!')
      } else if (message === '用户权限不足') {
        ElMessage.error('用户权限不足, 请联系管理员!')
        setLoginRole('user')
        setTimeout(() => (location.href = '/user'), 1000)
      } else {
        ElMessage.error(message)
      }
    } else {
      ElMessage.error('服务器异常, 请稍后再试')
      console.log(error)
    }

    return Promise.reject(error.response.data)
  }
)

export default instance
