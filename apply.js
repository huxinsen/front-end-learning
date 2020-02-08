// apply() 方法使用一个指定的 this 值和一个数组（类数组）参数来调用一个函数。
// 实现和 call() 类似，只是参数形式不同
Function.prototype.apply2 = function(context, args) {
  context = context || global
  context.fn = this
  let result
  // 判断是否有第二个参数
  if(args && args.length) {
      result = context.fn(...args)
  } else {
      result = context.fn()
  }
  delete context.fn
  return result
}

const numbers = [5, 6, 2, 3, 7]

const max = Math.max.apply2(null, numbers)

console.log(max) // 7
