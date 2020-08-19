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

const Speakable = ({ id, text, withSettings }) => {
  let settings = {
    ...defaultSettings,
    ...withSettings
  }
  let hash = crypto.createHash('md5').update(JSON.stringify({ text, settings })).digest('hex')
  let filename = `${id}-${hash}.wav`

  return {
    id,
    text,
    settings,
    hash,
    filename
  }
}

const extractSpeakableText = htmlString => {
  const dom = new JSDOM(htmlString)

  let firstH1 = dom.window.document.querySelector('h1')

  let data = []
  for (let el of dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, p')) {
    let id = el.getAttribute('id')

    let text = el.textContent.replace(/¶\s?/g, '')

    let effect = undefined
    switch (el.tagName.toLowerCase()) {
      case 'h1':
        if (el === firstH1) {
          effect = 'title'
        } else {
          effect = 'heading'
        }
        break
      case 'h2':
        effect = 'heading'
        break
      case 'h3':
      case 'h4':
      case 'h5':
        effect = 'subheading'
        break
      default:
        effect = undefined
    }

    let withSettings = {
      effect
    }

    data.push(Speakable({ id, text, withSettings }))
  }

  return data
}

module.exports = {
  extractSpeakableText,
  Speakable
}
