const path = require('path')
const fs = require('fs')
const markdownToHtml = require('./markdown-to-html')
const extractSpeakableText = require('./extract-speakable-text')
const TTS = require('./text-to-speech')
const asConcatFile = require('./as-concat-file')
const calculateDuration = require('./calculate-duration')
const updateHtmlWithTimestamps = require('./update-html-with-timestamps')
const concatAudio = require('./concat-audio')

;(async () => {
  let markdownFilePath = './A-Future-of-Visual-Storytelling.md'

  // create the output folder
  if (fs.existsSync('output') == false) {
    fs.mkdirSync('output')
  }

  // convert markdown to html
  let htmlString = markdownToHtml(markdownFilePath)

  // extract the speakable text from the HTML
  let speakable = extractSpeakableText(htmlString)

  // generate the source audio for the concat file
  for (let { id, filename, text, settings } of speakable) {
    let outfilepath = `output/${filename}`
    if (fs.existsSync(outfilepath) == false) {
      console.log('writing', outfilepath)
      let audio = await TTS.generate({ text, settings })
      fs.writeFileSync(outfilepath, audio)
    }
  }

  // calculate the timestamps from the generated audio

  let position = 0
  speakable.forEach((entry, n) => {
    let { id, filename, text } = entry
    let outfilepath = `output/${filename}`
    let metadatafilepath = `output/${filename}.json`

    if (fs.existsSync(metadatafilepath)) {
      speakable[n] = JSON.parse(fs.readFileSync(metadatafilepath, 'utf-8'))
    } else {
      console.log('calculating duration of', outfilepath)

      entry.duration = calculateDuration(outfilepath)
      entry.position = position.toFixed(3)
      fs.writeFileSync(metadatafilepath, JSON.stringify(entry, null, 2))
    }

    position += entry.duration
  })

  // update the HTML with the timestamps
  let htmlStringWithTimestamps = updateHtmlWithTimestamps(htmlString, speakable)

  // write the concat instruction file for ffmpeg to use
  let concatFile = asConcatFile(speakable)
  fs.writeFileSync(`output/concat.txt`, concatFile)

  // run ffmpeg on the concat instruction file to render the concatenated mp3
  console.log('concatenating audio to', 'output/rendered.mp3')
  concatAudio('output/rendered.mp3')

  // write the final HTML
  let htmloutfile = path.basename(markdownFilePath, path.extname(markdownFilePath)) + '.html'
  console.log('writing', `output/${htmloutfile}`)
  fs.writeFileSync(`output/${htmloutfile}`, htmlStringWithTimestamps)

  // TODO cleanup
  // remove output/*.wav
  // remove output/*.wav.json
  // remove output/*.txt
  // remove output/*.html
  // remove output/*.mp3
})()
