const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { isFolder, isImage } = require('./fsUtils')
const { getConfig } = require('./config')
const { listToGrid } = require('./grid')

async function joinImgs () {
  const {
    base,
    input,
    output,
    cols,
    gap
  } = getConfig()

  const [inputPath, outputPath] = [input, output].map(item => path.resolve(item))
  if (!isFolder(inputPath)) {
    return {
      success: false,
      code: 1,
      desc: `The folder is not exist!\nfolder: ${inputPath}`
    }
  }

  const imgPaths = getInputImgs(inputPath)
  if (!imgPaths.length) {
    return {
      success: false,
      code: 2,
      desc: `folder is empty, no picture found!\nfolder: ${inputPath}`
    }
  }

  const imgs = await Promise.all(imgPaths.map(async (item) => {
    const sh = sharp(item)
    const meta = await sh.metadata()
    return {
      ...meta,
      sh
    }
  }))

  const minHeight = Math.min.apply(null, imgs.map(item => item.height))
  const resizedImgs = await Promise.all(imgs.map(async (item) => {
    const buffer = await item.sh.resize({ height: minHeight }).toBuffer()
    const meta = await sharp(buffer).metadata()
    return {
      ...meta,
      buffer
    }
  }))

  const { cells, width, height } = listToGrid(resizedImgs, cols, gap)
  const imgGrid = cells.map(({ cell, x, y }) => ({
    input: cell.buffer,
    left: x,
    top: y
  }))

  sharp({
    create: {
      width,
      height,
      ...base
    }
  })
    .composite(imgGrid)
    .toFile(outputPath)

  return {
    success: true,
    code: 0,
    desc: outputPath
  }
}

function getInputImgs (folder) {
  return fs
    .readdirSync(folder, { withFileTypes: true })
    .filter(dt => {
      return dt.isFile() && isImage(dt.name)
    })
    .map(dt => path.resolve(path.join(folder, dt.name)))
}

module.exports = joinImgs
