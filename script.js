function updateSidenotes () {
  let asides = [...document.querySelectorAll('aside[name]')]

  for (let aside of asides) {
    let name = aside.getAttribute('name')
    let span = document.querySelector(`span[name="${name}"]`)
    let bodyRect = document.body.getBoundingClientRect()
    let elemRect = span.getBoundingClientRect()
    aside.style.top = Math.ceil(elemRect.top - bodyRect.top) + 'px'
  }
}

function resize () {
  updateSidenotes()
}

window.addEventListener('resize', resize)
resize()
setTimeout(resize, 200)
