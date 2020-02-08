// call() 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
// 思路：1.将函数设为 this 指向对象的属性 2.执行然后删除这个函数
Function.prototype.call2 = function(context, ...args) {
  context = context || global
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}

const obj = {
  value: 1,
}

function fn(name, age) {
  console.log(this.value)
  console.log(name)
  console.log(age)
}

fn.call2(obj, 'black', '18') // 1 black 18
