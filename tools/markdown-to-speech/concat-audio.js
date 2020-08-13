const { spawnSync } = require('child_process')

// via https://ffmpeg.org/ffmpeg-filters.html#concat
//     https://trac.ffmpeg.org/wiki/Concatenate#filter
//
// e.g.:
//
// ffmpeg                           \
//   -i output/1.wav                \
//   -i output/2.wav                \
//   -i output/3.wav                \
//   -filter_complex                \
//     "[0:a] [1:a] [2:a]           \
//      concat=n=3:v=0:a=1 [a]"     \
//   -map "[a]"                     \
//   -ac 1                          \
//   -b:a 192k                      \
//   -ar 24000                      \
//   -y                             \
//   output/concat.mp3

const concatAudio = (speakable, filepath) => {
  let inputs = speakable
    .map(data => data.outfile)
  
  let streams = speakable
      .map((entry, i) => `[${i}:a]`)
      .join(' ')

  let n = speakable.length

  let filtergraph = `${streams} concat=n=${n}:v=0:a=1 [outa]`

  let args = [
    '-loglevel', 8,

    ...inputs
      .map(f => ['-i', f])
      .flat(),

    '-filter_complex', filtergraph,
    '-map', '[outa]',

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
}

module.exports = concatAudio
