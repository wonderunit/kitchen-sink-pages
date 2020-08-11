const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const os = require('os')

const createTempFolder = () => {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'wonderunit-tts-'))
}

let folder

const start = () => {
  console.log('setup')
  folder = createTempFolder()
  console.log('created', folder)
}

const stop = () => {
  console.log('teardown')
  console.log('removing', folder)
  fs.rmdirSync(folder)
}

const generate = ({ text }) => {
  let tmpfilepath = path.join(folder, 'output.aiff')

  let { status, signal, stdout, stderr } = spawnSync(
    'say', [
      text,
      '-o', tmpfilepath
    ]
  )
  if (status) throw new Error(stderr.toString())

  let data = fs.readFileSync(tmpfilepath)
  fs.unlinkSync(tmpfilepath)

  return data
}

module.exports = {
  start,
  stop,
  generate
}
