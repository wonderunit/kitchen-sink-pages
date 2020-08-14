const { spawnSync } = require('child_process')

const NULLSRC = 0
const SFX_INTRO = 1
const SFX_BREAK = 2

const concatAudio = (speakable, filepath) => {
  let inputs = []
  let filters = []
  let outputs = []

  inputs[SFX_INTRO] = 'sounds/intro.aiff'
  inputs[SFX_BREAK] = 'sounds/break.aiff'

  let offset = 0 // msecs
  for (let entry of speakable) {
    let i = inputs.length
    inputs.push(entry.outfile)

    let inpad = `[${i}:a]`
    let outpad = `[s${i}]`

    if (entry.settings.effect == 'title') {
      filters.push(`[${SFX_INTRO}:0]adelay=${offset},volume=0.3,afade=t=out:st=${offset/1000 + 3}:d=2[s${i}fx]`)
      outputs.push(`[s${i}fx]`)

      offset += 2000

      entry.position = offset / 1000
      filters.push(`${inpad}adelay=${offset}${outpad}`)
      outputs.push(outpad)
      offset = offset + (entry.duration * 1000)

      offset += 2000

    } else if (entry.settings.effect == 'heading') {
      filters.push(`[${SFX_BREAK}:0]adelay=${offset},volume=0.4[s${i}fx]`)
      outputs.push(`[s${i}fx]`)

      offset += 1000

      entry.position = offset / 1000
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
    '-i', 'anullsrc=channel_layout=mono:sample_rate=24000',

    ...inputs
      .map(f => ['-i', f])
      .flat(),

    '-filter_complex', filtergraph,

    '-ac', 1,
    '-b:a', '192k',
    '-ar', '24000',

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
