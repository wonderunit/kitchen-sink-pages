const textToSpeech = require('@google-cloud/text-to-speech')

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './tts.json'
})

const generate = async ({ text, settings }) => {
  let request = {
    input: { text },
    ...settings
  }

  let [response] = await client.synthesizeSpeech(request)

  return response.audioContent
}

module.exports = {
  generate
}
