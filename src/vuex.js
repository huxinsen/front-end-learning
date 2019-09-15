let Vue // vue 的构造函数

const forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key])
  })
}

// 格式化用户传递的数据：
// let root = {
//   _raw: rootModule,
//   _children: {
//     a: {
//       _raw: aModule,
//       _children: {
//         c: {
//           _raw: bModule,
//           _children: {},
//           state: { z: 3 },
//         },
//       },
//       state: { x: 1 },
//     },
//     b: {
//       _raw: bModule,
//       _children: {},
//       state: { y: 2 },
//     },
//   },
//   state: { age: 10 },
// }

class ModuleCollection {
  constructor(options) {
    // 路径列表，初始为[]
    this.register([], options)
  }
  register(path, rootModule) {
    let newModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state,
    }
    if (path.length === 0) {
      // 根模块
      this.root = newModule
    } else {
      // 多层模块寻找上一级 parent
      // path: [a] => parent: this.root
      // path: [a, c] => parent: a
      let parent = path.slice(0, -1).reduce((root, current) => {
        return root._children[current]
      }, this.root)
      parent._children[path[path.length - 1]] = newModule
    }
    // 递归子模块
    if (rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
}

// 递归格式化后的树，将结果挂载到 getters mutations actions
const installModule = (store, state, path, rootModule) => {
  // 把子模块的状态加到父模块上
  if (path.length > 0) {
    // {age:10,a:{x:1,c:{z:3}},b:{y:2}}
    // path: [a] => parent: state; {age:10}
    // path: [a, c] => parent: a; {age:10,a:{x:1}}
    let parent = path.slice(0, -1).reduce((state, current) => {
      return state[current]
    }, state)
    // 使用 Vue.set(object, key, value) 方法将响应属性添加到嵌套的对象上
    Vue.set(parent, path[path.length - 1], rootModule.state)
  }

  let getters = rootModule._raw.getters
  if (getters) {
    // 为 store 增加 getters 属性
    forEach(getters, (getterName, fn) => {
      Object.defineProperty(store.getters, getterName, {
        get: () => {
          return fn(rootModule.state)
        },
      })
    })
  }

  let mutations = rootModule._raw.mutations
  if (mutations) {
    // 为 store 增加 mutations 属性
    forEach(mutations, (mutationName, fn) => {
      let arr =
        store.mutations[mutationName] || (store.mutations[mutationName] = [])
      arr.push(payload => {
        // 绑定 this(store)
        fn.call(store, rootModule.state, payload)
      })
    })
  }

  let actions = rootModule._raw.actions
  if (actions) {
    // 为 store 增加 actions 属性
    forEach(actions, (actionsName, fn) => {
      let arr = store.actions[actionsName] || (store.actions[actionsName] = [])
      arr.push(payload => {
        fn.call(store, store, payload)
      })
    })
  }

  // 递归子模块
  forEach(rootModule._children, (moduleName, module) => {
    installModule(store, state, path.concat(moduleName), module)
  })
}

class Store {
  constructor(options) {
    // this._vm = options.state // 视图不响应
    // 由于 Vue 会在初始化实例时对属性执行 getter/setter 转化过程，
    // 所以属性必须在 data 对象上存在才能让 Vue 转换它，这样才能让它是响应的。
    this._vm = new Vue({
      // 实现数据监听，否则视图不更新
      name: 'reactivity',
      data: {
        state: options.state, // 把对象变成可以监控的对象
      },
    })

    // // 不考虑模块：
    // const store = this
    // let getters = options.getters || {} // 用户传递过来的 getters
    // this.getters = {}
    // // 把 getters 属性定义到 this.getters 中，并且根据状态的变化，重新执行此函数
    // forEach(getters, (getterName, fn) => {
    //   Object.defineProperty(this.getters, getterName, {
    //     get: () => {
    //       return fn(store.state)
    //     },
    //   })
    // })

    // let mutations = options.mutations || {}
    // this.mutations = {}
    // forEach(mutations, (mutationName, fn) => {
    //   // 先把用户传递过来的 mutation 加到 store 实例上
    //   this.mutations[mutationName] = payload => {
    //     // 保证 fn 的 this 指向
    //     fn.call(store, store.state, payload)
    //   }
    // })

    // let actions = options.actions || {}
    // this.actions = {}
    // forEach(actions, (actionName, fn) => {
    //   this.actions[actionName] = payload => {
    //     fn.call(store, store, payload)
    //   }
    // })

    // // 绑定 this，确保 store 解构后 commit 的指向（或如下使用箭头函数）
    // const { dispatch, commit } = this
    // this.dispatch = function boundDispatch(type, payload) {
    //   return dispatch.call(store, type, payload)
    // }
    // this.commit = function boundCommit(type, payload) {
    //   return commit.call(store, type, payload)
    // }

    // 考虑模块：
    const store = this
    this.getters = {}
    this.mutations = {}
    this.actions = {}

    // 收集模块
    this.modules = new ModuleCollection(options)
    // 安装模块
    installModule(store, store.state, [], this.modules.root)
    console.log(this.modules)
  }
  dispatch = (type, payload) => {
    // 找到对应的 action 执行
    // 不考虑模块：
    // this.actions[type](payload)

    // 考虑模块：
    this.actions[type].forEach(fn => fn(payload))
  }
  commit = (type, payload) => {
    // 找到对应的 mutation 执行
    // 不考虑模块：
    // this.mutations[type](payload)

    // 考虑模块：
    this.mutations[type].forEach(fn => fn(payload))
  }
  get state() {
    return this._vm.state
  }
}

// vue的组件渲染：先渲染父组件，再渲染子组件（深度优先）
// parent Render
//    child Render
//    child Did
// parent Did

const install = _Vue => {
  Vue = _Vue
  // 给每个组件都注册一个 this.$store 的属性
  Vue.mixin({
    // [beforeCreate, beforeCreate]，新增钩子函数
    beforeCreate() {
      // 生命周期 组件创建之前
      // 先判断是父组件还是子组件，如果是子组件，把父组件的 store 增加给子组件
      console.log(this.$options.name)
      if (this.$options && this.$options.store) {
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    },
  })
}

export default {
  Store,
  install,
}
