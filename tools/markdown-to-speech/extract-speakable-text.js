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

const Speakable = ({ id, text, settings }) => {
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

    let changes = {}

    switch (el.tagName.toLowerCase()) {
      case 'h1':
        if (el === firstH1) {
          changes.effect = 'title'
          changes.audioConfig = { speakingRate: '1.0' }
        } else {
          changes.effect = 'heading'
        }
        break
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
        changes.effect = 'subheading'
        break
      default:
        changes.effect = undefined
    }

    let settings = {
      ...defaultSettings,
      effect: changes.effect,
      audioConfig: {
        ...defaultSettings.audioConfig,
        ...changes.audioConfig
      }
    }

    data.push(Speakable({ id, text, settings }))
  }

  return data
}

module.exports = {
  extractSpeakableText,
  Speakable,
  defaultSettings
}
