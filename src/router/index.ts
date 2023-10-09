import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: '前台解析中心' },
      component: () => import('../views/UserPannel.vue')
    },
    {
      path: '/install',
      name: 'install',
      meta: { title: '安装' },
      component: () => import('../views/InstallPannel.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登陆' },
      component: () => import('../views/LoginPannel.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      meta: { title: '后台控制中心' },
      component: () => import('../views/AdminPannel.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title
  next()
})

export default router
