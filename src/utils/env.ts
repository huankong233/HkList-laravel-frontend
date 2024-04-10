export const getPrefix = () => localStorage.getItem('admin_route_prefix') ?? '/admin'

export const setPrefix = (prefix: string) => localStorage.setItem('admin_route_prefix', prefix)

export const getLoginState = () => localStorage.getItem('login_state') ?? '0'

export const setLoginState = (state: '1' | '0') => localStorage.setItem('login_state', state)

export const getAppName = () =>
  document.querySelector("meta[name='app_name']")?.getAttribute('content') ?? '94list-laravel'

export const loadAria2Config = () => {
  const config = localStorage.getItem('aria2_config')
  return config
    ? JSON.parse(config)
    : {
        host: 'http://localhost',
        port: '6800',
        secret: ''
      }
}

export const setAria2Config = (config: { host: string; port: string; secret: string }) =>
  localStorage.setItem('aria2_config', JSON.stringify(config))

export const getFrontEndVersion = async () => {
  return (await import('../../package.json')).default.version
}
