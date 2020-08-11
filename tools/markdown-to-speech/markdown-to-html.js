const fs = require('fs')
const MarkdownIt = require('markdown-it')
const uslug = require('uslug')

const stripNumberPrefix = x => x.replace(/\d\.\s/, '')

const slugify = x => uslug(x)

const paragraphIds = (md, opts) => {
  let n = 1
  md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
    let response = `<p id="p${n++}">`
    return response
  }
}

const markdownToHtml = filepath => {
  const markdownString = fs.readFileSync(filepath, 'utf-8')

  let md = new MarkdownIt()
    .use(paragraphIds)
    .use(require('markdown-it-anchor'), {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '¶',
      slugify: x => slugify(stripNumberPrefix(x))
    })
    .use(require('markdown-it-toc-done-right'))

  return md.render(markdownString)
}

module.exports = markdownToHtml
