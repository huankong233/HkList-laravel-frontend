import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/user'
    },
    {
      path: '/user',
      name: 'user',
      meta: { title: '前台解析中心' },
      component: () => import('@/views/UserView.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: { title: '登陆' },
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      meta: { title: '注册' },
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      meta: { title: '后台控制中心' },
      component: () => import('@/views/AdminView.vue')
    },
    {
      path: '/install',
      name: 'install',
      meta: { title: '安装' },
      component: () => import('@/views/InstallView.vue')
    },
    {
      path: '/404',
      name: '404',
      meta: { title: '404页面不存在' },
      component: () => import('@/views/NotFoundView.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  ]
})

import { getAppName } from '@/utils/env.js'

router.beforeEach((to, from, next) => {
  // 需要在 index.html 里定义好
  document.title = `${to.meta.title} | ${getAppName()}`
  next()
})

export default router
