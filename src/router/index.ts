import { createRouter, createWebHashHistory } from 'vue-router'
import QuestionnairContainer from '@/views/questionnaire/questionnair-container.vue'
import OrderList from '@views/questionnaire-list/questionnaire-list.vue'
import OrderDetail from '@views/order-detail/order-detail.vue'
import ConfigList from '@views/config-list/config-list.vue'
import ManageHome from '@views/manage-home/manage-home.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  // mode: 'hash',
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/questionnaire',
    },
    {
      path: '/questionnaire/:id?',
      name: 'questionnaire',
      component: QuestionnairContainer,
    },
    {
      path: '/detail/:id',
      name: 'order-detail',
      component: OrderDetail,
    },
    {
      path: '/manage-home',
      // name: 'manage-home',
      component: ManageHome,
      children: [
        {
          path: '',
          // name: 'order-list',
          component: OrderList,
        },
        {
          path: 'config-list',
          name: 'config-list',
          component: ConfigList,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/list',
    },
  ],
})

export default router
