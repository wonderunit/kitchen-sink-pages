const smoothScrollTo = el => {
  document.documentElement.style.scrollBehavior = 'smooth'
  if (
    el.getBoundingClientRect().bottom > (document.documentElement.clientHeight - 100) ||
    el.getBoundingClientRect().top < 0
  ) {
    document.documentElement.scrollTop = el.offsetTop - 100 - 50
  }
  document.documentElement.style.scrollBehavior = ''
}

const getElementByFragment = fragment =>
  document.getElementById(
    new URL(event.target.href).hash.replace('#', '')
  )

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

  let onSpeakableClick = event => {
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

  // attach audio player control on click
  let els = document.querySelectorAll('[data-speak]')
  for (let el of els) {
    el.addEventListener('click', onSpeakableClick)
  }

  // attach key handler
  document.addEventListener('keydown', onKeyDown)

  // attach smooth scroll on click
  let onPermalinkClick = event => {
    event.preventDefault()

    let el = getElementByFragment(event.target)
    if (el) smoothScrollTo(el)
  }
  document.querySelectorAll('nav.table-of-contents a, a.speaker-icon, a.header-anchor')
    .forEach(el =>
      el.addEventListener('click', onPermalinkClick))
}

export default {
  init
}
