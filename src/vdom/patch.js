import { isSameNode } from './vnode'

/**
 * 通过虚拟 DOM 节点创建真实的 DOM 节点
 * @param {*} vnode 虚拟 DOM 节点
 */
function createDOMElementFromVnode(vnode) {
  const { type, children } = vnode
  if (type) {
    // 创建真实 DOM 节点并挂载到 vnode 的 domElement上
    const domElement = (vnode.domElement = document.createElement(type))
    updateProperties(vnode)
    if (Array.isArray(children)) {
      children.forEach(child =>
        domElement.appendChild(createDOMElementFromVnode(child))
      )
    }
  } else {
    vnode.domElement = document.createTextNode(vnode.text)
  }
  return vnode.domElement
}

/**
 * 更新真实 DOM 节点的属性
 * @param {*} vnode 虚拟 DOM 节点
 * @param {*} oldProps 旧属性对象
 */
function updateProperties(vnode, oldProps = {}) {
  const newProps = vnode.props // 新属性对象
  const domElement = vnode.domElement // 真实 DOM 节点
  // 先处理样式对象
  const oldStyle = oldProps.style || {}
  const newStyle = newProps.style || {}

  // style 的属性，如果在旧的样式对象里有，新的没有，需要删除
  for (const oldAttrName in oldStyle) {
    if (!newStyle[oldAttrName]) {
      domElement.style[oldAttrName] = ''
    }
  }
  // 把旧的属性对象中有的，新的属性对象里没有的属性删除
  for (const oldPropName in oldProps) {
    if (!newProps[oldPropName]) {
      delete domElement[oldPropName]
    }
  }
  // 添加（更新）新的属性
  for (const newPropName in newProps) {
    if (newPropName === 'style') {
      const styleObject = newProps.style
      for (const newAttrName in styleObject) {
        domElement.style[newAttrName] = styleObject[newAttrName]
      }
    } else {
      domElement[newPropName] = newProps[newPropName]
    }
  }
}

/**
 * 把一个虚拟 DOM 节点变成真实 DOM 节点挂载到容器上
 * @param {*} vnode 虚拟 DOM 节点
 * @param {*} container 容器
 */
export function mount(vnode, container) {
  const newDOMElement = createDOMElementFromVnode(vnode)
  container.appendChild(newDOMElement)
}

/**
 * 找出新旧虚拟 DOM 节点差异，更新到真实 DOM 上
 * @param {*} newVnode 新的虚拟 DOM 节点
 * @param {*} oldVnode 旧的虚拟 DOM 节点
 */
export function patch(newVnode, oldVnode) {
  // 如果新旧虚拟 DOM 节点类型不同，直接替换
  if (oldVnode.type !== newVnode.type) {
    oldVnode.domElement.parentNode.replaceChild(
      createDOMElementFromVnode(newVnode),
      oldVnode.domElement
    )
    return
  }
  // 如果新节点为文本节点
  if (typeof newVnode.text !== 'undefined') {
    oldVnode.domElement.textContent = newVnode.text
    return
  }
  // 如果类型一样，继续比较：1.属性 2.子节点
  const domElement = (newVnode.domElement = oldVnode.domElement)
  // 传入新虚拟 DOM 节点和旧属性对象，更新真实 DOM 节点的属性
  updateProperties(newVnode, oldVnode.props)
  const oldChildren = oldVnode.children // 旧虚拟 DOM 节点子节点
  const newChildren = newVnode.children // 新虚拟 DOM 节点子节点
  if (oldChildren.length > 0 && newChildren.length > 0) {
    updateChildren(domElement, oldChildren, newChildren)
  } else if (oldChildren.length > 0) {
    domElement.innerHTML = ''
  } else if (newChildren.length > 0) {
    newChildren.forEach(child => {
      domElement.appendChild(createDOMElementFromVnode(child))
    })
  }
}

/**
 * 创建节点的 key 属性到其在子节点列表的 index 的映射
 * @param {*} children 子节点列表
 */
function createKeyToIndexMap(children) {
  const map = {}
  children.forEach((child, index) => {
    if (child.key) {
      map[child.key] = index
    }
  })
  return map
}

/**
 * 更新真实 DOM 子节点
 * @param {*} parentDomElement 父节点真实 DOM 节点
 * @param {*} oldChildren 旧子节点
 * @param {*} newChildren 新子节点
 */
function updateChildren(parentDomElement, oldChildren, newChildren) {
  // 从两边向中间比较
  let oldStartIndex = 0, // 旧开始索引
    oldStartVnode = oldChildren[oldStartIndex] // 旧开始节点
  let oldEndIndex = oldChildren.length - 1, // 旧结束索引
    oldEndVnode = oldChildren[oldEndIndex] // 旧结束节点
  let newStartIndex = 0, // 新开始索引
    newStartVnode = newChildren[newStartIndex] // 新开始节点
  let newEndIndex = newChildren.length - 1, // 新结束索引
    newEndVnode = newChildren[newEndIndex] // 新结束节点
  // 旧子节点 key 到 index 的映射
  const oldKeyToIndexMap = createKeyToIndexMap(oldChildren)
  // 两个队列都没有循环结束
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      // 判断为`无效标记`，跳过该节点
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      // 判断为`无效标记`，跳过该节点
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameNode(oldStartVnode, newStartVnode)) {
      // 旧开始节点和新开始节点比较
      patch(newStartVnode, oldStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameNode(oldEndVnode, newEndVnode)) {
      // 旧结束节点和新结束节点比较
      patch(newEndVnode, oldEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameNode(oldEndVnode, newStartVnode)) {
      // 旧结束节点和新开始节点比较
      patch(newStartVnode, oldEndVnode)
      // 进行 DOM 移动，把旧结束真实 DOM 节点移动到头部
      parentDomElement.insertBefore(
        oldEndVnode.domElement,
        oldStartVnode.domElement
      )
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameNode(oldStartVnode, newEndVnode)) {
      // 旧开始节点和新结束节点比较
      patch(newEndVnode, oldStartVnode)
      // 进行 DOM 移动，把旧开始真实 DOM 节点移动到尾部
      parentDomElement.insertBefore(
        oldStartVnode.domElement,
        oldEndVnode.domElement.nextSibling
      )
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else {
      // 在旧子节点中查找是否存在`新开始节点`
      const oldIndexByKey = oldKeyToIndexMap[newStartIndex.key]
      if (!oldIndexByKey) {
        // 不存在则插到头部
        parentDomElement.insertBefore(
          createDOMElementFromVnode(newStartVnode),
          oldStartVnode.domElement
        )
      } else {
        // 存在则移动到头部
        const oldVnodeToMove = oldChildren[oldIndexByKey]
        // 节点类型不一样，则新建真实 DOM 节点插入
        if (newStartVnode.type !== oldVnodeToMove.type) {
          parentDomElement.insertBefore(
            createDOMElementFromVnode(newStartVnode),
            oldStartVnode.domElement
          )
        } else {
          // 节点类型一样，则更新属性后移动
          patch(newStartVnode, oldVnodeToMove)
          // 设置`无效标记`，下次跳过此节点不处理
          oldChildren[oldIndexByKey] = undefined
          parentDomElement.insertBefore(
            oldVnodeToMove.domElement,
            oldStartVnode.domElement
          )
        }
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }
  // 旧队列处理完毕，新队列未处理完
  if (newStartIndex <= newEndIndex) {
    // 判断插入到哪个节点前面
    // 旧：A B C D ^   |     Â B C D
    // 新：A B C D E F | E F A B C D
    const beforeDOMElement = newChildren[newEndIndex + 1]
      ? newChildren[newEndIndex + 1].domElement
      : null
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      parentDomElement.insertBefore(
        createDOMElementFromVnode(newChildren[i]),
        beforeDOMElement
      )
    }
  }
  // 新队列处理完毕，旧队列未处理完
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      parentDomElement.removeChild(oldChildren[i].domElement)
    }
  }
}
