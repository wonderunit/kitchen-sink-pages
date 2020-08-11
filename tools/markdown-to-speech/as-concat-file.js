module.exports = speakable => speakable
  .map(entry => `file '${entry.basename + '.aiff'}'`)
  .join('\n')
