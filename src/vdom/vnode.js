const VNODE_TYPE = 'VNODE_TYPE'

/**
 * 返回虚拟 DOM 节点
 * @param {*} type 节点标签类型：'div'，'ul'，...
 * @param {*} key 标记
 * @param {*} props 属性对象
 * @param {*} children 子节点
 * @param {*} text 文本
 * @param {*} domElement 对应的真实 DOM 节点
 */
export function vnode(type, key, props = {}, children = [], text, domElement) {
  return {
    _type: VNODE_TYPE, // 表示这是一个虚拟 DOM 节点
    type,
    key,
    props,
    children,
    text,
    domElement,
  }
}

/**
 * 判断是否为同一种节点
 * @param {*} oldVnode 旧节点
 * @param {*} newVnode 新节点
 */
export function isSameNode(oldVnode, newVnode) {
  // 如果两个虚拟 DOM 节点类型一样，且 key（包括 undefined） 一样，
  // 则是一种节点，可以进行深度比较
  return oldVnode.type === newVnode.type && oldVnode.key === newVnode.key
}

export default vnode
