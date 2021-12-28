import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
//导入全局样式表
import './assets/css/global.css';
//导入字体库
import './assets/fonts/iconfont.css';
import axios from 'axios';
import ZkTable from 'vue-table-with-tree-grid';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'; // import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://www.tangxiaoyang.vip:8888/api/v2/';
//拦截所有请求，微请求头添加token认证
axios.interceptors.request.use((config) => {
  NProgress.start();
  console.log('config:', config);
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  config.headers.Authorization = userInfo ? userInfo.token : '';
  return config;
});

axios.interceptors.response.use((config) => {
  NProgress.done();
  return config;
});

//工具库
import utils from './libs/utils';
Vue.prototype.$utils = utils;
Vue.prototype.$http = axios;

Vue.use(VueQuillEditor);

//全局注册第三方表格组件
Vue.component('tree-table', ZkTable);
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
