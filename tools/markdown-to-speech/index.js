const path = require('path')
const fs = require('fs')
const markdownToHtml = require('./markdown-to-html')
const { extractSpeakableText, Speakable, defaultSettings } = require('./extract-speakable-text')
const TTS = require('./text-to-speech')
const calculateDuration = require('./calculate-duration')
const updateHtmlWithTimestamps = require('./update-html-with-timestamps')
const concatAudio = require('./concat-audio')

;(async () => {
  let markdownFilePath = path.join(__dirname, 'A-Future-of-Visual-Storytelling.md')

  // create the output folder
  if (fs.existsSync('output') == false) {
    fs.mkdirSync('output')
  }

  // convert markdown to html
  const markdownString = fs.readFileSync(markdownFilePath, 'utf-8')
  let htmlString = markdownToHtml(markdownString)

  // extract the speakable text from the HTML
  let speakable = extractSpeakableText(htmlString)

  // inject the byline
  //
  // TODO extract data from .md front matter
  let byline = 'Wonder Unit'
  let published = 'August 18th, 2020'
  //
  speakable.splice(1, 0, Speakable({
    id: 'byline',
    text: `An article by ${byline}. First Published ${published}.`,
    settings: {
      ...defaultSettings,
      effect: 'byline'
    }
  }))

  // generate the source audio
  for (let { id, filename, text, settings } of speakable) {
    let outfilepath = `output/${filename}`
    if (fs.existsSync(outfilepath) == false) {
      console.log('writing', outfilepath)
      let audio = await TTS.generate({ text, settings })
      fs.writeFileSync(outfilepath, audio)
    }
  }

  // calculate the timestamps from the generated audio
  speakable.forEach((entry, n) => {
    let { id, filename, text } = entry
    let outfilepath = `output/${filename}`
    let metadatafilepath = `output/${filename}.json`

    if (fs.existsSync(metadatafilepath)) {
      speakable[n] = JSON.parse(fs.readFileSync(metadatafilepath, 'utf-8'))
    } else {
      console.log('calculating duration of', outfilepath)

      entry.duration = calculateDuration(outfilepath)
      fs.writeFileSync(metadatafilepath, JSON.stringify(entry, null, 2))
    }
  })

  // run ffmpeg on the concat instruction file to render the concatenated mp3
  speakable.forEach((entry, n) => {
    entry.outfile = `output/${entry.filename}`
  })
  console.log('concatenating audio to', 'output/rendered.mp3')
  speakable = concatAudio(speakable, 'output/rendered.mp3')

  // update the HTML with the timestamps
  let htmlStringWithTimestamps = updateHtmlWithTimestamps(htmlString, speakable)

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
