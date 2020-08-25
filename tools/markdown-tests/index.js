const fs = require('fs')
const markdownToHtml = require('../markdown-to-speech/markdown-to-html.js')

let markdownFilePath = './shot-core.md'

let markdownString = fs.readFileSync(markdownFilePath, 'utf-8')
let htmlString = markdownToHtml(markdownString)

console.log(htmlString)
