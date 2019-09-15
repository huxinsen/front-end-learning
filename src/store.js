import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex) // 使用插件，会默认调用该库的 install 方法

export default new Vuex.Store({
  // 模块
  modules: {
    a: {
      state: {
        x: 1,
      },
      mutations: {
        changeX(state, payload) {
          state.x += payload
        },
      },
      modules: {
        c: {
          state: {
            z: 3,
          },
        },
      },
    },
    b: {
      state: {
        y: 2,
      },
    },
  },
  state: {
    age: 23,
  },
  getters: {
    herAge(state) {
      return state.age + 1
    },
  },
  mutations: {
    syncAdd(state, payload) {
      state.age += payload
    },
    syncMinus(state, payload) {
      state.age -= payload
    },
  },
  actions: {
    asyncMinus({ commit }, payload) {
      setTimeout(() => {
        commit('syncMinus', payload)
        console.log(this)
      }, 1000)
    },
  },
})
