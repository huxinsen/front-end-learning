let avatar = document.getElementById('avatar')
let avatarWrapper = document.getElementById('avatar-wrapper')
let left = document.getElementById('left')
let right = document.getElementById('right')
let save = document.getElementById('save')
let compositeAvatar = document.getElementById('composite-avatar')
let cancel = document.getElementById('cancel')

let arr = ['./images/happy.png', './images/70years.png', './images/panda.png']
let index = 0

left.onclick = function() {
  index--
  index < 0 ? (index = arr.length - 1) : null
  avatarWrapper.src = arr[index]
}

right.onclick = function() {
  index++
  index > arr.length - 1 ? (index = 0) : null
  avatarWrapper.src = arr[index]
}

save.onclick = function() {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  canvas.width = 200
  canvas.height = 200
  ctx.drawImage(avatar, 0, 0, 200, 200)
  ctx.drawImage(avatarWrapper, 0, 0, 200, 200)
  compositeAvatar.src = canvas.toDataURL('image/png')
  show.style.display = 'block'
}

cancel.onclick = function() {
  show.style.display = 'none'
}
