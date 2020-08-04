import sidenotes from './sidenotes.js'
import galleries from './galleries.js'

function resize() {
  sidenotes.update()
}

window.addEventListener('resize', resize)

galleries.init()
sidenotes.init()
resize()
setTimeout(resize, 200)
