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

const renderHighlight = curr => {
  let prev = document.querySelector('[data-speak-active') 
  if (prev) {
    delete prev.dataset.speakActive
  }
  if (curr) {
    curr.dataset.speakActive = true
  }
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

  let onTimeUpdate = event => {
    // get the current time
    let { currentTime } = event.target
    // find the closest speak-start w/o going over
    let els = document.querySelectorAll('[data-speak-start]')
    let match
    for (let el of els) {
      if (parseFloat(el.dataset.speakStart) <= currentTime) {
        match = el
      } else {
        break
      }
    }
    // set the current speak-start time and scroll to the element
    let start = parseFloat(match.dataset.speakStart)
    if (context.curr != start) {
      context.curr = start
      smoothScrollTo(match)
    }
    renderHighlight(match.parentNode)
  }

  // attach currentTime listener
  player.addEventListener('timeupdate', onTimeUpdate)

  // don't highlight when paused
  player.addEventListener('pause', () => renderHighlight(null))

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
