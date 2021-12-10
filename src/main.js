import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
//导入字体库
import './assets/fonts/iconfont.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'


Vue.config.productionTip = false

axios.defaults.baseURL = 'http://www.tangxiaoyang.vip:8888/api/v2/'
//拦截所有请求，微请求头添加token认证
axios.interceptors.request.use(config =>{
  console.log('config:',config)
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  config.headers.Authorization = userInfo ? userInfo.token : ''
  return config
})

Vue.prototype.$http = axios

//全局注册第三方表格组件
Vue.component(ZkTable.name, ZkTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
