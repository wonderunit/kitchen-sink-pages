const fs = require('fs')
const { JSDOM } = require('jsdom')

const updateHtmlWithTimestamps = (htmlString, speakable) => {
  const dom = new JSDOM(htmlString)

  for (let a of dom.window.document.querySelectorAll('a.header-anchor')) {
    let h = a.parentNode

    let id = h.getAttribute('id')
    let { position } = speakable.find(d => d.id == id)

    let div = dom.window.document.createElement('div')
    div.innerHTML = `<a class="speaker-icon" data-speak data-speak-start="${position}" href="#${id}"></a>`.trim()
    h.prepend(div.firstChild)
  }

  for (let p of dom.window.document.querySelectorAll('p')) {
    let id = p.getAttribute('id')
    let { position } = speakable.find(d => d.id == id)

    let div = dom.window.document.createElement('div')
    div.innerHTML = `<a class="speaker-icon" data-speak data-speak-start="${position}" href="#${id}"></a>`.trim()
    p.prepend(div.firstChild)
  }

  return dom.serialize()
}

module.exports = updateHtmlWithTimestamps
