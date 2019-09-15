import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  name: 'root',
  store, // 会在当前的每个 vue 的实例里都增加一个 this.$store
  render: h => h(App),
}).$mount('#app')
