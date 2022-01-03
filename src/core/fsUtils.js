const fs = require('fs')
const path = require('path')

function isFolder (folderPath) {
  return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()
}

function isImage (name) {
  const { ext } = path.parse(name)
  return [
    '.jpg',
    '.jpeg',
    '.png'
  ].includes(ext.toLowerCase())
}

module.exports = {
  isFolder,
  isImage
}
