const path = require('path')
const { writeFile } = require('fs/promises')

const defaultConfig = {
  base: {
    channels: 4,
    background: {
      r: 255,
      g: 255,
      b: 255,
      alpha: 0
    }
  },
  input: 'input',
  output: 'ouput.png',
  cols: 2,
  gap: 10
}

function getConfigPath () {
  const userHome = process.env.HOME || process.env.USERPROFILE
  return path.join(userHome, 'imgjoin.json')
}

function getConfig () {
  const configPath = getConfigPath()
  let userConfig
  try {
    delete require.cache[require.resolve(configPath)]
    userConfig = require(configPath)
  } catch {
    userConfig = {}
  }
  return {
    ...defaultConfig,
    ...userConfig
  }
}

function setConfig (value) {
  const config = JSON.stringify(value, null, 2)
  return writeFile(getConfigPath(), config)
}

module.exports = {
  getConfig,
  setConfig
}
