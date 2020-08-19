const init = () => {
  let player = document.querySelector('audio[data-audio-player]')
  let ui = document.querySelector('.audio-player')

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
    ui.querySelector('.button').classList.remove('button--play')
    ui.querySelector('.button').classList.add('button--pause')
    ui.classList.add('audio-player--active')
  }

  // attach currentTime listener
  player.addEventListener('timeupdate', onTimeUpdate)

  // attach pause/play listener
  player.addEventListener('pause', onPause)
  player.addEventListener('play', onPlay)

  // setup ui
  ui.addEventListener('click', () => {
    if (player.paused) {
      player.play()
    } else {
      player.pause()
    }
  })
}

export default {
  init
}
