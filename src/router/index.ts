import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/questionnaire',
    },
    {
      path: '/questionnaire/:id?',
      name: 'questionnaire',
      component: () => import('@/views/questionnaire/questionnair-container.vue'),
    },
    {
      path: '/detail/:id',
      name: 'order-detail',
      component: () => import('@views/order-detail/order-detail.vue'),
    },
    {
      path: '/manage-home',
      name: 'manage-home',
      component: () => import('@views/manage-home/manage-home.vue'),
      redirect: '/manage-home/order-list',
      children: [
        {
          path: 'order-list',
          name: 'order-list',
          component: () => import('@views/questionnaire-list/questionnaire-list.vue'),
        },
        {
          path: 'config-list',
          name: 'config-list',
          component: () => import('@views/config-list/config-list.vue'),
        },
      ],
    },
    {
      path: '/404',
      component: () => import('@views/not-found/not-found.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

export default router
