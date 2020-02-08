// const newObj = JSON.parse(JSON.stringify(oldObj))
// 1.无法实现对函数、RegExp 等特殊对象的克隆
// 2.会抛弃对象的 constructor，所有的构造函数会指向 Object
// 3.对象有循环引用，会报错

// 判断对象类型
const isType = (obj, type) => {
  if (typeof obj !== 'object') return false
  // 判断数据类型的经典方法：
  const typeString = Object.prototype.toString.call(obj)
  let flag
  switch (type) {
    case 'Array':
      flag = typeString === '[object Array]'
      break
    case 'Date':
      flag = typeString === '[object Date]'
      break
    case 'RegExp':
      flag = typeString === '[object RegExp]'
      break
    default:
      flag = false
  }
  return flag
}

// 克隆 RegExp 类型
function copyRegExp(regExp) {
  let flags = ''
  if (regExp.global) flags += 'g'
  if (regExp.ignoreCase) flags += 'i'
  if (regExp.multiline) flags += 'm'
  const newRegExp = new RegExp(regExp.source, flags)
  newRegExp.lastIndex = regExp.lastIndex
  return newRegExp
}

/**
 * deep clone
 * @param source object 需要进行克隆的对象
 * @return 深克隆后的对象
 */
const clone = source => {
  // 维护储存循环引用的数组
  const circularList = []

  const _clone = source => {
    if (source === null) return null
    if (typeof source !== 'object') return source

    let target

    if (isType(source, 'Array')) {
      // 对数组做特殊处理
      target = []
    } else if (isType(source, 'Date')) {
      // 对 Date 对象做特殊处理
      target = new Date(source.getTime())
    } else if (isType(source, 'RegExp')) {
      // 对正则对象做特殊处理
      target = copyRegExp(source)
    } else {
      // 处理对象原型
      target = Object.create(Object.getPrototypeOf(source))
    }

    // 处理循环引用
    const index = circularList.indexOf(source)

    if (index != -1) {
      // 如果数组存在本对象,说明之前已经被引用过,直接返回此对象
      return circularList[index]
    }
    circularList.push(source)

    for (let i in source) {
      if (source.hasOwnProperty(i)) {
        target[i] = _clone(source[i]) // 递归
      }
    }

    return target
  }

  return _clone(source)
}

function Person(pname) {
  this.name = pname
}

const Messi = new Person('Messi')

function say() {
  console.log('hi')
}

const oldObj = {
  a: say,
  c: new RegExp('ab+c', 'i'),
  d: Messi,
}

oldObj.b = oldObj

const newObj = clone(oldObj)

// [Function: say] [Function: say]
console.log(newObj.a, oldObj.a)
// { a: [Function: say], c: /ab+c/i, d: Person { name: 'Messi' }, b: [Circular] } { a: [Function: say], c: /ab+c/i, d: Person { name: 'Messi' }, b: [Circular] }
console.log(newObj.b, oldObj.b)
// /ab+c/i /ab+c/i
console.log(newObj.c, oldObj.c)
// [Function: Person] [Function: Person]
console.log(newObj.d.constructor, oldObj.d.constructor)
