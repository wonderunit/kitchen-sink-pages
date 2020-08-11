const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const calculateDuration = filepath => {
  let { status, signal, stdout, stderr } = spawnSync(
    'ffprobe', [
      '-v', 'error',
      '-show_entries', 'stream=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filepath
    ]
  )
  if (status) throw new Error(stderr.toString())
  return parseFloat(stdout.toString().trim())
}

module.exports = calculateDuration
