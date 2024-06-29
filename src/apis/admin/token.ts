import axios from '@/utils/request.js'

export interface addTokenSingle {
  type: 'single'
  name: string
  count: number
  size: number
  day: number
}

export interface addTokenRandom {
  type: 'random'
  count: number
  size: number
  day: number
  token_count: number
}

export type addToken = addTokenSingle | addTokenRandom

export const addTokenSingle = (data: addTokenSingle) => axios.post<null>('/admin/token', data)

export const addTokenRandom = (data: addTokenRandom) =>
  axios.post<null>('/admin/token/generate', data)

export interface Token {
  id: number
  name: string
  count: number
  size: number
  day: number
  expired_at: string
  created_at: string
  updated_at: string
}

export interface getToken {
  current_page: number
  data: Token[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: string
  to: number
  total: number
}

export const getToken = (data: { page: number; size: number }) =>
  axios.get<getToken>(`/admin/token?page=${data.page}&size=${data.size}`)

export const updateToken = (token: Token) => axios.patch<null>(`/admin/token/${token.id}`, token)

export const deleteToken = (token: Token) =>
  axios.delete<null>(`/admin/token`, { data: { token_ids: [token.id] } })

export const deleteTokens = (token_ids: number[]) =>
  axios.delete<null>('/admin/token', { data: { token_ids } })
