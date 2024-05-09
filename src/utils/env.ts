export const getLoginState = () => localStorage.getItem('login_state') ?? '0'

export const setLoginState = (state: '1' | '0') => localStorage.setItem('login_state', state)

export const getLoginRole = () => localStorage.getItem('login_role') ?? 'admin'

export const setLoginRole = (role: 'user' | 'admin') => localStorage.setItem('login_role', role)

export const getFrontEndVersion = async () => (await import('../../package.json')).default.version

export const getAppName = () =>
  document.querySelector("meta[name='app_name']")?.getAttribute('content') ?? '94list-laravel'

interface aria2Config {
  host: string
  port: number
  token: string
}

export const loadAria2Config = () => {
  const config = localStorage.getItem('aria2_config')
  return config
    ? (JSON.parse(config) as aria2Config)
    : {
        host: 'http://localhost',
        port: 6800,
        token: ''
      }
}

export const setAria2Config = (config: aria2Config) =>
  localStorage.setItem('aria2_config', JSON.stringify(config))
