function init() {
  let sidebar = document.querySelector('.right-sidebar')
  let asides = [...document.querySelectorAll('aside[name]')]
  for (let aside of asides) {
    aside.parentNode.removeChild(aside)
    sidebar.appendChild(aside)
  }
}
function update() {
  let asides = [...document.querySelectorAll('aside[name]')]

  for (let aside of asides) {
    let name = aside.getAttribute('name')
    let span = document.querySelector(`span[name="${name}"]`)
    let containerRect = document.querySelector('.right-sidebar').getBoundingClientRect()
    let elemRect = span.getBoundingClientRect()

    let styles = window.getComputedStyle(span)
    let spanLineHeight = parseInt(styles.getPropertyValue('line-height')) * 0.7 // optical adjustment

    let offset = 0
    offset += span.offsetParent.offsetTop

    aside.style.top =
      Math.ceil(elemRect.bottom - spanLineHeight - containerRect.top - offset) +
      'px'
    aside.style.display = 'block'
  }
}

export default {
  init,
  update
}
