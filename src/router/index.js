import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    //路由懒加载
    component: () => import('../components/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../components/index/Welcome.vue'),
      },
      {
        path: '/users',
        component: () => import('../components/user/Users.vue'),
      },
      {
        path: '/rights',
        component: () => import('../components/power/Rights.vue'),
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles.vue'),
      },
      {
        path: '/categories',
        component: () => import('../components/goods/Cate.vue'),
      },
      {
        path: '/params',
        component: () => import('../components/goods/Params.vue'),
      },
      {
        path: '/goods',
        component: () => import('../components/goods/List.vue'),
      },
      {
        path: '/goods/add',
        component: () => import('../components/goods/Add.vue'),
      },
      {
        path: '/goods/edit',
        component: () => import('../components/goods/Edit.vue'),
      },
      {
        path: '/orders',
        component: () => import('../components/order/List.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

//配置路由守卫
router.beforeEach(async (to, from, next) => {
  //如果用户未登录，则放行
//   if (to.path === '/login') {
//     return next();
//   }
//   //如果用户未登录，则跳转到登陆页面
//   const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
//   if (!userInfo) {
//     return next('./login');
//   }
//   //如果用户已登陆，则放行
//   next();
  new Promise((resolve)=>{
    setTimeout(()=>{
      resovle();
    }, 5000)
  }).then(()=>{next();})
});

export default router;
