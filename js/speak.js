const init = () => {
  let context = { curr: null }
  let player = document.querySelector('audio[data-audio-player]')

  let onKeyDown = event => {
    if (event.key == 's') {
      player.currentTime = 0
      player.play()
    }
    if (event.key == 'Escape' || event.key == '.') {
      player.pause()
    }
  }

  let onClick = event => {
    event.preventDefault()

    let start = parseFloat(event.target.dataset.speakStart)

    // already playing this section?
    if (start == context.curr) {
      // ... then toggle on/off
      if (player.paused) {
        context.curr = start
        player.currentTime = start
        player.play()
      } else {
        player.pause()
      }
    } else {
      // not already playing this section, so play
      context.curr = start
      player.currentTime = start
      player.play()
    }
  }

  let els = document.querySelectorAll('[data-speak]')
  for (let el of els) {
    el.addEventListener('click', onClick)
  }

  document.addEventListener('keydown', onKeyDown)
}

export default {
  init
}
