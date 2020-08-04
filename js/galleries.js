function parseFigureEl (figureEl) {
  let linkEl = figureEl.children[0] // <a> element

  let item = parseLinkEl(linkEl)

  if (figureEl.children.length > 1) {
    // <figcaption> content
    item.title = figureEl.children[1].innerHTML.trim()
  }

  if (linkEl.children.length > 0) {
    // <img> thumbnail element, retrieving thumbnail url
    item.msrc = linkEl.children[0].getAttribute('src')
  }

  item.el = figureEl // save link to element for getThumbBoundsFn

  return item
}

function parseLinkEl (linkEl) {
  let size = linkEl.getAttribute('data-size').split('x')

  // create slide object
  return {
    src: linkEl.getAttribute('href'),
    w: parseInt(size[0], 10),
    h: parseInt(size[1], 10)
  }
}

function parseThumbnailElements (el) {
  let thumbElements = el.childNodes,
    numNodes = thumbElements.length,
    items = [],
    figureEl

  for (let i = 0; i < numNodes; i++) {
    figureEl = thumbElements[i] // <figure> element

    // include only element nodes
    if (figureEl.nodeType !== 1) {
      continue
    }

    items.push(parseFigureEl(figureEl))
  }

  return items
}

function init () {
  let pswpElement = document.querySelectorAll('.pswp')[0]

  let options = {
    mainClass: 'pswp--minimal--dark',
    barsSize: { top: 0, bottom: 0 },
    captionEl: false,
    fullscreenEl: false,
    shareEl: false,
    bgOpacity: 0.85,
    tapToClose: true,
    tapToToggleControls: false,
    history: false
  }

  let onGalleryClick = (event) => {
    event.preventDefault()

    if (event.target.tagName === 'IMG') {
      let gallery = event.target.closest('[data-gallery]')
      let parent = event.target.closest('a')
      let index = [
        ...event.target.closest('[data-gallery]').querySelectorAll('a')
      ].indexOf(parent)
      let items = parseThumbnailElements(gallery)

      let ps = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, {
        ...options,
        index
      })
      ps.init()
    }
  }

  let onFigureClick = event => {
    event.preventDefault()

    let figure = event.target.closest('figure')

    let ps = new PhotoSwipe(
      pswpElement,
      PhotoSwipeUI_Default,
      [parseFigureEl(figure)],
      {
      ...options,
      index: 0
      }
    )
    ps.init()
  }

  let figures = [...document.querySelectorAll('figure')]
    .filter(el => el.parentNode.dataset.gallery == null)
  for (let figure of figures) {
    figure.addEventListener('click', onFigureClick)
  }
  

  let galleries = [...document.querySelectorAll('[data-gallery]')]
  for (let gallery of galleries) {
    gallery.addEventListener('click', onGalleryClick)
  }
}

export default {
  init
}
