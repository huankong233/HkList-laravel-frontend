import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
  baseURL: 'http://localhost/api',
  timeout: 600000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// http response 响应拦截器
instance.interceptors.response.use(
  response => response.data,
  error => {
    const {
      response: {
        data: { message }
      }
    } = error

    if (message != '' && message != null && message != undefined) {
      if (message === 'Unauthenticated.' || message === 'CSRF token mismatch.') {
        ElMessage({
          type: 'error',
          message: '登陆已过期,请重新登陆'
        })
        setTimeout(() => (window.location.href = '/'), 1000)
      } else {
        ElMessage({
          type: 'error',
          message
        })
      }
      return Promise.reject(error.response.data)
    } else {
      ElMessage({
        type: 'error',
        message: '服务器异常，请稍后再试'
      })
    }
  }
)

export default instance
