const figlet = require('figlet')
const chalk = require('chalk')

async function showTitle (title = 'Image Mosaic') {
  return new Promise(resolve => {
    figlet(title, (err, data) => {
      const text = err ? title : data
      console.log(chalk.green(text))
      resolve(true)
    })
  })
}

module.exports = showTitle
