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
  // for table of contents, headline permalink icon, speaker icon
  let onAnchorClick = event => {
    event.preventDefault()

    let url = new URL(event.target.href)
    let id = url.hash.replace('#', '')
    let el = document.getElementById(id)

    if (el) {
      // only update URL fragment (hash) for table of contents and header permalink anchors
      // ignore for paragraph anchors
      if (el.tagName.toLowerCase() != 'p') {
        window.location.hash = id
      }
      smoothScrollTo(el)
    }
  }
  document.querySelectorAll('nav.table-of-contents a, a.header-anchor, a.speaker-icon')
    .forEach(el =>
      el.addEventListener('click', onAnchorClick))

  // attach "copy on click" handler
  let onCopyableClick = event =>
    navigator.clipboard.writeText(event.target.href)
  document.querySelectorAll('a.header-anchor')
    .forEach(el =>
      el.addEventListener('click', onCopyableClick))
}

export default {
  init
}
