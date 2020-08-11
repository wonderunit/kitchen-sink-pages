const { JSDOM } = require('jsdom')

const extractSpeakableText = htmlString => {
  const dom = new JSDOM(htmlString)

  // omit the title H1
  let titleHeading = dom.window.document.querySelector('h1')
  titleHeading.parentNode.removeChild(titleHeading)

  let data = []
  for (let el of dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, p')) {
    let id = el.getAttribute('id')

    let text = el.textContent.replace(/¶\s?/g, '')

    data.push({ id, basename: id, text })
  }

  return data
}

module.exports = extractSpeakableText
