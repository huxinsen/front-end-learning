// bind 调用参数: 1.第一个参数指定新函数的 this 2. 其余参数将作为新函数的参数
// 特点：1.创建一个新的函数 2.传递预置参数
// 实现思路：1.返回函数 2.处理 this 3.参数的处理 4.构造函数模拟实现
Function.prototype.bind2 = function(context, ...args1) {
  const self = this // 保存原函数
  if (typeof self !== 'function') {
    throw new TypeError(
      'Function.prototype.bind - ' +
        'what is trying to be bound is not callable'
    )
  }
  const Fn = function(...args2) {
    // 如果使用 new 运算符构造绑定函数，则忽略 context
    self.apply(this instanceof Fn ? this : context, args1.concat(args2))
  }
  Fn.prototype = Object.create(this.prototype) // 考虑实例化后对原型链的影响
  return Fn
}

const obj = {
  value: 6,
}

function fn(name, age) {
  console.log('value: ', this.value)
  console.log('name: ', name)
  console.log('age: ', age)
  // this.name = name
  // this.age = age
}

// fn.prototype.a = 'aaa'

const newFn = fn.bind2(obj, 'Daniel')
newFn(24) // value: 6 name: Daniel age: 24
// const instance = new newFn(24)
// console.log('name: ', instance.name)
// console.log('age: ', instance.age)
// console.log('a: ', instance.a)
