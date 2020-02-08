const template = '我是{{name}}，性别{{sex}}，年龄{{age}}岁'
const data = {
  name: '坦普雷特',
  age: 6,
  sex: '男',
}

function render(template, data) {
  const reg = /\{\{(\w+)\}\}/
  if (reg.test(template)) {
    const key = reg.exec(template)[1]
    template = template.replace(reg, data[key])
    return render(template, data)
  }
  return template
}

console.log(render(template, data))
