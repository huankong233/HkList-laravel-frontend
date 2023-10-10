export const getPrefix = () => localStorage.getItem('admin_route_prefix') ?? '/admin'

export const setPrefix = (prefix: string) => localStorage.setItem('admin_route_prefix', prefix)

export const getLoginState = () => localStorage.getItem('login_state') ?? '0'

export const setLoginState = (state: '1' | '0') => localStorage.setItem('login_state', state)

export const getAppName = () =>
  document.querySelector("meta[name='app_name']")?.getAttribute('content') ?? '94list-laravel'
