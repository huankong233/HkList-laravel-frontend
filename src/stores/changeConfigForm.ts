import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as mainConfigApi from '@/apis/admin/config/main.js'

export const useChangeConfigForm = defineStore('changeConfigForm', () => {
  const changeConfigForm = ref<mainConfigApi.config>({
    version: '',
    front_end_version: '',
    sleep: 0,
    max_once: 0,
    password: '',
    announce: '',
    user_agent: '',
    need_inv_code: false,
    whitelist_mode: false,
    show_copyright: false,
    custom_copyright: '',
    main_server: '',
    code: '',
    parse_mode: 0,
    max_filesize: 0,
    min_single_file: 0,
    token_mode: false,
    button_link: '',
    limit_cn: false,
    limit_prov: false,
    debug: false,
    name: '',
    show_login_button: false,
    token_bind_ip: false,
    proxy_server: '',
    proxy_password: ''
  })

  return {
    changeConfigForm
  }
})
