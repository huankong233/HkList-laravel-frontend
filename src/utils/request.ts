import { getLoginState } from './env'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { setLoginState } from '@/utils/env.js'

const instance = axios.create({
  baseURL: '/api',
  timeout: 600000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

interface _response {
  code: number
  message: string
  data: any
}

export type response = Promise<_response>

// http response 响应拦截器
instance.interceptors.response.use(
  response => response.data,
  error => {
    const {
      response: {
        data: { message }
      }
    }: {
      response: {
        data: _response
      }
    } = error

    if (message) {
      if (message === 'Unauthenticated.') {
        ElMessage.error('登陆已过期,请重新登陆')
        setLoginState('0')
        setTimeout(() => (window.location.href = '/login'), 1000)
      } else if (message.includes('is not supported for route')) {
        if (getLoginState() === '1') {
          ElMessage.error('路由前缀设置错误,请重新登陆')
          setLoginState('0')
          setTimeout(() => (window.location.href = '/login'), 1000)
        } else {
          ElMessage.error('路由前缀设置错误')
        }
      } else {
        ElMessage.error(message)
      }
    } else {
      ElMessage.error('服务器异常，请稍后再试')
    }

    // return Promise.reject(error.response.data)
  }
)

export default instance
