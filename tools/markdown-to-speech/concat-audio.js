const { spawnSync } = require('child_process')

const concatAudio = filepath => {
  let { status, signal, stdout, stderr } = spawnSync(
    'ffmpeg', [
      '-loglevel', 8,
      '-f', 'concat',
      '-i', 'output/concat.txt',

      '-ac', 1,
      '-b:a', '192k',
      '-ar', '24000',

      '-y',
      filepath
    ]
  )
  if (status) throw new Error(stderr.toString())
}

module.exports = concatAudio
