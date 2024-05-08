import type { config } from '@/apis/user/parse.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('mainStore', () => {
  const config = ref<config>({
    announce: '',
    user_agent: '',
    debug: false,
    max_once: 0,
    have_account: false,
    have_login: false,
    need_inv_code: false,
    need_password: false
  })

  return { config }
})
