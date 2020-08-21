const clamp = (x, min, max) => x < min ? min : x > max ? max : x

const init = () => {
  let player = document.querySelector('audio[data-audio-player]')
  let ui = document.querySelector('.audio-player')

  let context = { playedOnce: false }

  let onTimeUpdate = event => {
    // get the current time
    let { currentTime } = event.target

    // update the ui
    let totalTime = event.target.duration
    ui.querySelector('.progress').style.width = ((currentTime / totalTime) * 100) + '%'
  }

  let onPause = () => {
    ui.querySelector('.button').classList.add('button--play')
    ui.querySelector('.button').classList.remove('button--pause')
  }

  let onPlay = () => {
    context.playedOnce = true

    ui.querySelector('.button').classList.remove('button--play')
    ui.querySelector('.button').classList.add('button--pause')
    ui.classList.add('audio-player--active')
  }

  // attach currentTime listener
  player.addEventListener('timeupdate', onTimeUpdate)

  // attach pause/play listener
  player.addEventListener('pause', onPause)
  player.addEventListener('play', onPlay)

  // button: pause/play on click
  ui.querySelector('.button').addEventListener('click', event => {
    if (player.paused) {
      player.play()
    } else {
      player.pause()
    }
  })

  // progress bar: scrubbing
  let onPointerMove = event => {
    let x = event.offsetX
    let w = ui.querySelector('.progress-bar').getBoundingClientRect().width
    let v = clamp(x / w, 0, 1)
    player.currentTime = player.duration * v
  }
  ui.querySelector('.progress-bar').addEventListener('pointerdown', () => {
    ui.querySelector('.progress-bar').addEventListener('pointermove', onPointerMove)
    onPointerMove(event)
  })
  ui.querySelector('.progress-bar').addEventListener('pointerup', () => {
    onPointerMove(event)
  })
  document.addEventListener('pointerup', () => {
    ui.querySelector('.progress-bar').removeEventListener('pointermove', onPointerMove)
  })

  // when header scrolls in or out of view, update ui
  let callback = ([entry]) => {
    if (entry.intersectionRatio > 0) {
      ui.classList.remove('audio-player--fixed')
    } else {
      ui.classList.add('audio-player--fixed')

      // hide if 1) not playing, 2) never played before, and user scrolled past the header
      if (player.paused && context.playedOnce == false) {
        ui.classList.remove('audio-player--active')
      }
    }
  }
  let observer = new IntersectionObserver(callback, { threshold: 0 })
  observer.observe(document.querySelector('header'))

  // show initially
  ui.classList.add('audio-player--active')
}

export default {
  init
}
