import sidenotes from './sidenotes.js'
import galleries from './galleries.js'
import speak from './speak.js'

function resize() {
  sidenotes.update()
}

window.addEventListener('resize', resize)

galleries.init()
sidenotes.init()
speak.init()
resize()
setTimeout(resize, 200)
