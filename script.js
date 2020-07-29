function updateSidenotes () {
  let asides = [...document.querySelectorAll('aside[name]')]

  for (let aside of asides) {
    let name = aside.getAttribute('name')
    let span = document.querySelector(`span[name="${name}"]`)
    let bodyRect = document.body.getBoundingClientRect()
    let elemRect = span.getBoundingClientRect()

    let styles =  window.getComputedStyle(span);
    let spanLineHeight = parseInt(styles.getPropertyValue('line-height')) * 0.7 // optical adjustment

    let parentOffset = span.offsetParent.offsetTop
    aside.style.top = Math.ceil(elemRect.bottom - spanLineHeight - bodyRect.top - parentOffset) + 'px'
  }
}

function resize () {
  updateSidenotes()
}

 var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

;(() => {
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

  let click = event => {
    event.preventDefault()

    if (event.target.tagName === 'IMG') {
      let gallery = event.target.closest('[data-gallery]')
      let parent = event.target.closest('a')
      let index = [...event.target.closest('[data-gallery]').querySelectorAll('a')].indexOf(parent)
      let items = parseThumbnailElements(gallery)

      let ps = new PhotoSwipe(
        pswpElement,
        PhotoSwipeUI_Default,
        items,
        {
          ...options,
          index
        }
      )
      ps.init()
    }
  }
  let galleries = [...document.querySelectorAll('[data-gallery]')]
  for (let gallery of galleries) {
    gallery.addEventListener('click', click)
  }
})()

window.addEventListener('resize', resize)
resize()
setTimeout(resize, 200)
