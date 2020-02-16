import { h, mount, patch } from './vdom'

// DOM DIFF 原则：尽量少操作 DOM

const root = document.getElementById('root')
const oldVnode = h(
  'ul',
  { id: 'container', style: { border: '10px solid green', height: '150px' } },
  h('li', { style: { backgroundColor: '#110000' }, key: 'a' }, 'A'),
  h('li', { style: { backgroundColor: '#440000' } }, 'B'),
  h('li', { style: { backgroundColor: '#770000' }, key: 'c' }, 'C'),
  h('li', { style: { backgroundColor: '#AA0000' } }, 'D')
)
const newVnode = h(
  'ul',
  { id: 'container', style: { border: '10px solid blue', height: '200px' } },
  h('li', { style: { backgroundColor: '#330000' } }, 'B1'),
  h('li', { style: { backgroundColor: '#110000' }, key: 'a' }, 'A1'),
  h('li', { style: { backgroundColor: '#DD0000' }, key: 'g' }, 'G'),
  h('li', { style: { backgroundColor: '#BB0000' } }, 'F'),
  h('li', { style: { backgroundColor: '#990000' } }, 'E'),
  h('li', { style: { backgroundColor: '#550000' }, key: 'c' }, 'C1')
)

// 把虚拟 DOM 节点挂载到 root 上
mount(oldVnode, root)

setTimeout(() => {
  patch(newVnode, oldVnode)
}, 3000)
