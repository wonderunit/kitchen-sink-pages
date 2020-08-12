const { spawnSync } = require('child_process')

const concatAudio = filepath => {
  let { status, signal, stdout, stderr } = spawnSync(
    'ffmpeg', [
      '-loglevel', 8,
      '-f', 'concat',
      '-i', 'output/concat.txt',
      filepath
    ]
  )
  if (status) throw new Error(stderr.toString())
}

module.exports = concatAudio