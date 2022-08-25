import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: 'login',
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login-page" */ '../pages/login-page')
      },
      {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "register-page" */ '../pages/register-page')
      }
    ]
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
