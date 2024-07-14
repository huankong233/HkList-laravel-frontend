import * as ParseApi from '@/apis/user/parse.js'
import * as UserApi from '@/apis/user/user.js'
import { getRemberAnnounce, setLoginRole, setLoginState } from '@/utils/env.js'
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
    button_link: '',
    show_login_button: false
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

  const getConfig = async (show = true) => {
    const configRes = await ParseApi.getConfig()
    const data = configRes.data

    data.announce = data.announce.replaceAll('[NextLine]', '<br>')
    if (data.announce === getRemberAnnounce()) data.show_announce = false
    if (!show) data.show_announce = false

    config.value = {
      ...data,
      is_https: document.location.protocol === 'https:'
    }

    setLoginState(data.have_login ? '1' : '0')
  }

  return {
    config,
    logout,
    getConfig
  }
})
