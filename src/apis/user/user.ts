import axios from '@/utils/request.js'

export const login = (data: { username: string; password: string }) =>
  axios.post<{ role: 'admin' | 'user' }>('/user/login', data)

export const register = (data: { username: string; password: string; inv_code?: string }) =>
  axios.post<null>('/user/register', data)

export const logout = () => axios.delete<null>('/user')
