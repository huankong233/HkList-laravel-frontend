import * as ParseApi from '@/apis/user/parse.js'
import * as UserApi from '@/apis/user/user.js'
import { setLoginRole, setLoginState } from '@/utils/env.js'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('mainStore', () => {
  const config = ref<ParseApi.config & { is_https: boolean }>({
    show_announce: false,
    announce: '',
    debug: false,
    max_once: 0,
    have_account: false,
    have_login: false,
    need_inv_code: false,
    need_password: false,
    is_https: false,
    show_copyright: false,
    custom_copyright: '',
    min_single_file: 0,
    token_mode: false,
    button_link: ''
  })

  const logout = async () => {
    try {
      await UserApi.logout()
    } finally {
      setLoginState('0')
      setLoginRole('user')
      location.reload()
      ElMessage.success('退出登陆成功~')
    }
  }

  return {
    config,
    logout
  }
})
