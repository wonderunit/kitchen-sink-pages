module.exports = speakable => speakable
  .map(entry => `file '${entry.filename}'`)
  .join('\n')
