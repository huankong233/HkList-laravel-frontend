import type { FormInstance } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreDefinition } from 'pinia'

export const useInstallPannelStore: StoreDefinition = defineStore('InstallPannel', () => {
  const installForm = ref({
    db_connection: '',
    db_host: 'localhost',
    db_port: '3306',
    db_database: '94list',
    db_username: '94list',
    db_password: '',
    app_name: '94list-laravel',
    app_url: '',
    admin_route_prefix: '/admin',
    pending: false,
    installed: false
  })

  const installFormRef = ref<FormInstance | null>(null)

  return { installForm, installFormRef }
})
