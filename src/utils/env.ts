export const getLoginState = () => localStorage.getItem('login_state') ?? '0'

export const setLoginState = (state: '1' | '0') => localStorage.setItem('login_state', state)

export const getFrontEndVersion = async () => (await import('../../package.json')).default.version

export const getAppName = () =>
  document.querySelector("meta[name='app_name']")?.getAttribute('content') ?? '94list-laravel'
