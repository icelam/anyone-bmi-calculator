import Router from 'vue-router';
import Vue from 'vue';
import landingPage from '@pages/landing/index.vue';

Vue.use(Router);

export default new Router({
  base: process.env.VUE_APP_ROUTER_BASE,
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '任何仁BMI計算機',
      component: landingPage
    }
  ]
});
