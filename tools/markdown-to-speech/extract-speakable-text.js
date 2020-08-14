const { JSDOM } = require('jsdom')
const crypto = require('crypto')

const defaultSettings = {
  voice: {
    'languageCode': 'en-US',
    'name': 'en-US-Wavenet-D'
  },
  audioConfig: {
    audioEncoding: 'LINEAR16',
    pitch: '-5.00',
    'speakingRate': '1.25'
  },
  effect: undefined
}

const extractSpeakableText = htmlString => {
  const dom = new JSDOM(htmlString)

  // omit the title H1
  // let titleHeading = dom.window.document.querySelector('h1')
  // titleHeading.parentNode.removeChild(titleHeading)

  let data = []
  for (let el of dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, p')) {
    let id = el.getAttribute('id')

    let text = el.textContent.replace(/¶\s?/g, '')

    let effect = undefined
    switch (el.tagName.toLowerCase()) {
      case 'h1':
        effect = 'title'
        break
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
        effect = 'heading'
        break
      default:
        effect = undefined
    }

    let settings = {
      ...defaultSettings,
      effect
    }

    let hash = crypto.createHash('md5').update(JSON.stringify({ text, settings })).digest('hex')

    let filename = `${id}-${hash}.wav`

    data.push({
      id,
      text,
      hash,
      filename,
      settings
    })
  }

  return data
}

module.exports = extractSpeakableText
