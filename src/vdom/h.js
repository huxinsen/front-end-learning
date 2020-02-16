import vnode from './vnode'
const hasOwnProperty = Object.prototype.hasOwnProperty

// 虚拟 DOM 就是一个普通 JavaScript 对象

/**
 * 创建虚拟 DOM
 * @param {*} type 节点标签类型：'div'，'ul'，...
 * @param {*} config 属性对象
 * @param  {...any} children 子节点虚拟 DOM
 */
function h(type, config, ...children) {
  const props = {} // 属性对象
  let key // 单独处理 key
  if (config && config.key) {
    key = config.key
  }
  // 迭代 config 的每一个属性
  for (let propName in config) {
    if (hasOwnProperty.call(config, propName) && propName !== 'key') {
      props[propName] = config[propName]
    }
  }

  return vnode(
    type,
    key,
    props,
    children.map(child =>
      typeof child === 'string' || typeof child === 'number'
        ? vnode(undefined, undefined, undefined, undefined, child)
        : child
    )
  )
}

export default h
