import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/login/Login.vue'
import HomePage from '../views/home/HomePage.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/homePage',
    name: 'HomePage',
    component: HomePage,
    children: [
      {
        path: 'orderList',
        component: () => import('../views/business/orderlist/OrderList.vue'),
        name: 'OrderList'
      },
      {
        path: 'dynamicGraph',
        component: () => import('../views/business/dynamicgraph/DynamicGraph.vue'),
        name: 'DynamicGraph'
      },
      {
        path: 'report',
        component: () => import('../views/business/report/Report.vue'),
        name: 'Report'
      },
      {
        path: 'config',
        component: () => import('../views/config/SystemConfig.vue'),
        name: 'SystemConfig'
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

export default router;
