class Promise {
  constructor(executor) {
    // 参数校验
    if (typeof executor !== 'function') {
      throw new TypeError(`Promise resolver ${executor} is not a function`)
    }

    this.initValue()
    this.initBind()

    try {
      executor(this.resolve, this.reject) // 立即执行
    } catch (e) {
      this.reject(e) // 如果 executor 执行报错，直接执行 reject
    }
  }

  // 初始化值
  initValue() {
    this.value = null // 成功的值
    this.reason = null // 失败的原因
    this.state = Promise.PENDING // 初始状态为等待态
    this.onFulfilledCallbacks = [] // 成功回调，存放 onFulfilled 的数组
    this.onRejectedCallbacks = [] // 失败回调，存放 onRejected 的数组
  }

  // 绑定 this
  initBind() {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  // 成功后的一系列操作（改变状态、存储成功的值、执行成功回调）
  resolve(value) {
    if (this.state === Promise.PENDING) {
      this.state = Promise.FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn(this.value))
    }
  }

  // 失败后的一系列操作（改变状态、存储失败的原因、执行失败回调）
  reject(reason) {
    if (this.state === Promise.PENDING) {
      this.state = Promise.REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn(this.reason))
    }
  }

  // 当状态为 fulfilled，执行 onFulfilled，传入 this.value；当状态为 rejected，执行 onRejected，传入 this.reason
  then(onFulfilled, onRejected) {
    // onFulfilled 如果不是函数，就忽略 onFulfilled，直接返回 value
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : value => value
    // onRejected 如果不是函数，就忽略 onRejected，直接扔出错误
    // (如果直接等于 reason => reason，则会传到下一个 then 中的 onFulfilled 中)
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason
          }

    // 为了实现链式调用，默认在第一个 then 里面返回一个新的 promise，称为 promise2
    // 将这个 promise2 返回的值传递到下一个 then 中
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === Promise.FULFILLED) {
        // Promises/A+ 规定 onFulfilled 或 onRejected 不能被同步调用，必须被异步调用
        setTimeout(() => {
          // 如果 onFulfilled 或 onRejected 报错，则直接 reject
          try {
            let x = onFulfilled(this.value)
            // resolvePromise 函数，处理我们自己 return 的值和默认返回的 promise2 的关系
            Promise.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.state === Promise.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            Promise.resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      // 当状态 state 还是等待态，将 onFulfilled 和 onRejected 存起来，一旦 resolve 或 reject，就调用它们
      // 由于一个 promise 可以有多个 then，所以存在同一个数组内
      // 多个 then 的情况：
      // let p = new Promise()
      // p.then()
      // p.then()
      if (this.state === Promise.PENDING) {
        this.onFulfilledCallbacks.push(value => {
          setTimeout(() => {
            try {
              let x = onFulfilled(value)
              Promise.resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })

        this.onRejectedCallbacks.push(reason => {
          setTimeout(() => {
            try {
              let x = onRejected(reason)
              Promise.resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })

    return promise2
  }
}

Promise.PENDING = 'pending'
Promise.FULFILLED = 'fulfilled'
Promise.REJECTED = 'rejected'

// Promises/A+ 规定 onFulfilled() 或 onRejected() 的值，即第一个 then 返回的值，叫做 x，判断 x 的函数叫做 resolvePromise
// resolve 和 reject 是 promise2 的
Promise.resolvePromise = function(promise2, x, resolve, reject) {
  // 循环引用判断
  if (x === promise2) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  // 防止多次调用
  let called = false
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // x 不是null 且 x 是对象或者函数
    try {
      let then = x.then // Promises/A+ 规定，声明 then 等于 x 的 then 方法
      // 如果 then 是函数，就默认 x 是 promise
      if (typeof then === 'function') {
        then.call(
          x,
          value => {
            // onFulfilled 和 onRejected 只能调用一个
            if (called) return
            called = true
            Promise.resolvePromise(promise2, value, resolve, reject) // 继续解析
          },
          reason => {
            if (called) return
            called = true
            reject(reason)
          },
        )
      } else {
        resolve(x) // 直接 resolve
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e) // 取 then 出错就不再继续执行
    }
  } else {
    resolve(x) // 如果是普通值，直接 resolve
  }
}

// 测试自己实现的 promise 符不符合 Promises/A+ 规范
Promise.defer = Promise.deferred = function() {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = Promise
