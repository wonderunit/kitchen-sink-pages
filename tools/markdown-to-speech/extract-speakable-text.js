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
  }
}

const extractSpeakableText = htmlString => {
  const dom = new JSDOM(htmlString)

  // omit the title H1
  let titleHeading = dom.window.document.querySelector('h1')
  titleHeading.parentNode.removeChild(titleHeading)

  let data = []
  for (let el of dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, p')) {
    let id = el.getAttribute('id')

    let text = el.textContent.replace(/¶\s?/g, '')

    let settings = {
      ...defaultSettings
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
