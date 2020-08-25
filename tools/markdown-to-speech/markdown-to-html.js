const fs = require('fs')
const MarkdownIt = require('markdown-it')
const uslug = require('uslug')

const stripNumberPrefix = x => x.replace(/\d\.\s/, '')

const slugify = x => uslug(stripNumberPrefix(x))

const paragraphIds = (md, opts) => {
  let n = 1
  md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
    let response = `<p id="p${n++}">`
    return response
  }
}

const markdownToHtml = markdownString => {
  let md = new MarkdownIt({
    typographer: true
  })
    .use(paragraphIds)
    .use(require('markdown-it-anchor'), {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '¶',
      slugify
    })
    .use(require('markdown-it-toc-done-right'), {
      slugify
    })

  return md.render(markdownString)
}

module.exports = markdownToHtml
