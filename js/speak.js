const init = () => {
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

    if (player.paused) {
      player.currentTime = parseFloat(event.target.dataset.speakStart)
      player.play()
    } else {
      player.pause()
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
