import axios from '@/utils/request.js'

export interface config {
  switch: boolean
  host: string
  port: string
  username: string
  password: string
  encryption: 'ssl' | 'tls'
  from_address: string
  from_name: string
  to_address: string
  to_name: string
}

export const getConfig = () => axios.get<config>('/admin/config/mail')

export const updateConfig = (data: config) => axios.patch<null>('/admin/config/mail', data)

export const sendTestMail = (data: config) => axios.post<null>('/admin/config/mail', data)
