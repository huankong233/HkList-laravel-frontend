import axios from 'axios'
import { ElMessage } from 'element-plus'
import { setLoginState } from '@/utils/env.js'
import { useRouter } from 'vue-router'

const instance = axios.create({
  baseURL: '/api/v1',
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
    const message = error.response.data?.message

    if (message) {
      if (message === '用户未登陆') {
        ElMessage.error('登陆已过期,请重新登陆')
        setLoginState('0')
        const router = useRouter()
        setTimeout(() => router.push('/login'), 1000)
      } else {
        ElMessage.error(message)
      }
    } else {
      ElMessage.error('服务器异常，请稍后再试')
    }

    return Promise.reject(error.response.data)
  }
)

export default instance
