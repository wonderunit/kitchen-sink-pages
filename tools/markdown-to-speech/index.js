const path = require('path')
const fs = require('fs')
const markdownToHtml = require('./markdown-to-html')
const extractSpeakableText = require('./extract-speakable-text')
const TTS = require('./text-to-speech')
const asConcatFile = require('./as-concat-file')
const calculateDuration = require('./calculate-duration')
const updateHtmlWithTimestamps = require('./update-html-with-timestamps')
const concatAudio = require('./concat-audio')

let markdownFilePath = './A-Future-of-Visual-Storytelling.md'

// create the output folder
if (!fs.existsSync('output')) {
  fs.mkdirSync('output')
}

// convert markdown to html
let htmlString = markdownToHtml(markdownFilePath)

// extract the speakable text from the HTML
let speakable = extractSpeakableText(htmlString)

// generate the source audio for the concat file
TTS.start()
for (let { id, basename, text } of speakable) {
  let outfilepath = `output/${basename}.aiff`
  console.log('writing', outfilepath)
  let audio = TTS.generate({ text })
  fs.writeFileSync(outfilepath, audio)
}
TTS.stop()

// calculate the timestamps from the generated audio

let position = 0
for (let entry of speakable) {
  let { id, basename, text } = entry
  let outfilepath = `output/${basename}.aiff`

  console.log('calculating duration of', outfilepath)

  entry.duration = calculateDuration(outfilepath)
  entry.position = position.toFixed(3)
  position += entry.duration
}

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
//
// remove output/*.aiff
// remove output/*.txt
