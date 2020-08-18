const { spawnSync } = require('child_process')

const NULLSRC = 0
const SFX_INTRO = 1
const SFX_HEADING = 2

const concatAudio = (speakable, filepath) => {
  let inputs = []
  let filters = []
  let outputs = []

  inputs[SFX_INTRO] = 'sounds/intro.aiff'
  inputs[SFX_HEADING] = 'sounds/heading.aiff'

  let byline = speakable.find(entry => entry.settings.effect === 'byline')

  let offset = 0 // msecs
  for (let entry of speakable) {
    let i = inputs.length
    inputs.push(entry.outfile)

    let inpad = `[${i}:a]`
    let outpad = `[s${i}]`

    if (entry.settings.effect == 'title') {
      entry.position = offset / 1000

      // play the intro sound
      filters.push(`[${SFX_INTRO}:0]adelay=${offset},volume=0.3[s${i}fx]`)
      outputs.push(`[s${i}fx]`)

      // wait 1s
      offset += 1000

      // play the title reading
      filters.push(`${inpad}adelay=${offset}${outpad}`)
      outputs.push(outpad)

      if (byline) {
        // byline will start immediately after the title
        offset = offset + (entry.duration * 1000)
      } else {
        // wait 8s of silence before continuing
        offset += 8000
      }

    } else if (entry.settings.effect == 'byline') {
      entry.position = offset / 1000
      filters.push(`${inpad}adelay=${offset}${outpad}`)
      outputs.push(outpad)
      offset = offset + (entry.duration * 1000)

      // then wait 4s of silence before continuing
      offset += 4000

    } else if (entry.settings.effect == 'heading') {
      entry.position = offset / 1000

      // play the heading sound
      filters.push(`[${SFX_HEADING}:0]adelay=${offset},volume=1.0[s${i}fx]`)
      outputs.push(`[s${i}fx]`)

      // wait 1s
      offset += 1000

      // play the heading reading
      filters.push(`${inpad}adelay=${offset}${outpad}`)
      outputs.push(outpad)
      offset = offset + (entry.duration * 1000)

    } else {
      entry.position = offset / 1000
      filters.push(`${inpad}adelay=${offset}${outpad}`)
      outputs.push(outpad)
      offset = offset + (entry.duration * 1000)
    }
  }

  let last = speakable[speakable.length - 1]
  let total = last.position + last.duration
 
  // first input is silence for the entire duration
  // so that amix can mix over it (duration=first)
  filters.unshift(`[${NULLSRC}:0]atrim=duration=${total}[sn]`)
  outputs.unshift(`[sn]`)

  let n = outputs.length
  filters.push(`${outputs.join('')}amix=inputs=${n}:duration=first:dropout_transition=99999999,volume=${n}`)

  let filtergraph = filters.join(';')

  let args = [
    '-f', 'lavfi',
    '-i', 'anullsrc=channel_layout=mono:sample_rate=44100',

    ...inputs
      .map(f => ['-i', f])
      .flat(),

    '-filter_complex', filtergraph,

    '-ac', 1,
    '-b:a', '192k',
    '-ar', '44100',

    '-y',
    filepath
  ]

  let { status, signal, stdout, stderr } = spawnSync(
    'ffmpeg', args
  )
  if (status) throw new Error(stderr.toString())

  return speakable
}

module.exports = concatAudio
