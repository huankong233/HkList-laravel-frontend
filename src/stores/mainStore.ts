import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { config } from '@/apis/user/parse.js'

export const useMainStore = defineStore('mainStore', () => {
  const config = ref<config>({
    announce: '',
    user_agent: '',
    debug: false,
    max_once: 0,
    have_account: false,
    have_login: false,
    need_inv_code: false,
    need_password: false,
    need_captcha: false,
    captcha_info: {
      use: ''
    }
  })

  return { config }
})
