import axios from '@/utils/request.js'

export interface install {
  db_connection: 'sqlite' | 'mysql'
  db_host: string
  db_port: string
  db_database: string
  db_username: string
  db_password: string
  app_name: string
}

export const install = (data: install) => axios.post<null>('/install', data)
