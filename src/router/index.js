import Vue from 'vue'
// import VueRouter from 'vue-router' // 官方实现
import VueRouter from './vue-router' // 自己简易实现
import routes from './routes'

// 注册插件
Vue.use(VueRouter)

// 创建 router 实例，然后传入 `routes` 配置
export default new VueRouter({
  mode: 'hash', // 控制路由的实现模式: hash/history
  routes
})