class HistoryRoute {
  constructor() {
    this.current = {
      hash: '',
      path: ''
    }
  }
}

class VueRouter {
  constructor(options) {
    this.mode = options.mode || 'hash'
    this.routes = options.routes || []
    // 将传递的路由表数组转为 Map => {路径: 组件}
    this.routesMap = this.createMap(this.routes)
    // 路由中需要存放当前的路径（状态）
    this.history = new HistoryRoute
    this.init()
  }

  // 初始化操作
  init() {
    if(this.mode === 'hash') {
      // 判断打开时有无 hash，没有就跳转到 #/
      location.hash ? '' : location.hash = '#/'
      window.addEventListener('DOMContentLoaded', () => {
        this.history.current.hash = location.hash
      })
      window.addEventListener('hashchange', () => {
        this.history.current.hash = location.hash
      })
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        this.history.current.path = location.pathname
      })
      window.addEventListener('popstate', () => {
        this.history.current.path = location.pathname
      })
    }
  }
  createMap(routes) {
    return routes.reduce((pre, cur) => {
      pre[cur.path] = cur.component
      return pre
    }, {})
  }
}

// 使用 Vue.use 就会调用 install 方法（=> 传递属性和组件）
VueRouter.install = function(Vue) {
  // 在所有组件中，获取同一个路由的实例
  Vue.mixin({ // 混合方法
    beforeCreate() {
      if (this.$options && this.$options.router) { // 定位根组件
        this._root = this // 把当前实例挂载在 _root 上
        this._router = this.$options.router // 把 router 实例挂载在 _router 上
        // 监听 router 数据变化，以便更新 router-view
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // Vue 组件的渲染顺序，父 -> 子
        // 为每个组件传递根组件，方便访问 router 信息
        this._root = (this.$parent && this.$parent._root) || this
      }
    }
  })

  // 通过给 Vue.prototype 定义 $router、$route 属性，把它们注入到所有组件中
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._root._router
    }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._root._route
    }
  })

  // 注册 router-link 组件
  Vue.component('router-link', {
    props: {
      to: String,
      tag: {
        type: String,
        default: 'a'
      }
    },
    methods: {
      handleClick(event) {
        event.preventDefault()
        const mode = this._self._root._router.mode
        if(mode === 'hash') {
          location.hash = `#${this.to}`
        } else {
          history.pushState({}, null, this.to)
          this._self._root._router.history.current.path = this.to
        }
      }
    },
    render() {
      const tag = this.tag
      return <tag on-click={this.handleClick} href=''>{this.$slots.default}</tag>
    }
  })

  // 注册 router-view 组件
  // 根据当前状态 current 和路由表 routes，获取对应组件
  Vue.component('router-view', {
    render(h) {
      const mode = this._self._root._router.mode
      const current = this._self._root._router.history.current
      let routeKey
      if(mode === 'hash') {
        routeKey = current.hash.slice(1)
      } else {
        routeKey = current.path
      }
      const routesMap = this._self._root._router.routesMap
      return h(routesMap[routeKey])
    }
  })
}
export default VueRouter
