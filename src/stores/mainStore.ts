import * as ParseApi from '@/apis/user/parse.js'
import * as UserApi from '@/apis/user/user.js'
import { setLoginRole, setLoginState } from '@/utils/env.js'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useMainStore = defineStore('mainStore', () => {
  const config = ref<ParseApi.config & { is_https: boolean }>({
    show_announce: false,
    announce: '',
    user_agent: '',
    debug: false,
    max_once: 0,
    have_account: false,
    have_login: false,
    need_inv_code: false,
    need_password: false,
    is_https: false,
    show_copyright: false,
    custom_copyright: '本项目半开源, 项目地址: https://github.com/huankong233/94list-laravel'
  })

  const router = useRouter()

  const logout = async () => {
    try {
      await UserApi.logout()
    } finally {
      setLoginState('0')
      setLoginRole('user')
      router.push('/')
      ElMessage.success('退出登陆成功~')
    }
  }

  return {
    config,
    logout
  }
})
