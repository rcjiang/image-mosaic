const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt')
const chalk = require('chalk')
const { getConfig, setConfig } = require('../core/config')
const { isFolder } = require('../core/fsUtils')

inquirer.registerPrompt('file-tree-select', inquirerFileTreeSelection)

function toInt (val, min = 0, max = 10) {
  const value = parseInt(val) || 0
  if (value < min) return min
  if (value > max) return max
  return value
}

const options = [
  {
    name: 'input',
    type: 'file-tree-select',
    message: '要拼接的图片所在文件夹:',
    onlyShowDir: true,
    onlyShowValid: true,
    filter: value => {
      return path.resolve(value)
    },
    validate: value => {
      return isFolder(path.resolve(value))
    }
  },
  {
    name: 'output',
    type: 'input',
    message: '拼接后的图片输出路径:',
    filter: value => {
      const pathObj = path.parse(value)
      const { root, name, ext } = pathObj
      if (!fs.existsSync(path.resolve(root))) {
        pathObj.dir = process.cwd()
      }
      if (!name) {
        pathObj.name = 'output'
      }
      const lExt = ext.toLowerCase()
      if (!['.png', '.jpg', '.jpeg', '.gif'].includes(lExt)) {
        pathObj.ext = '.png'
      }
      return path.format(pathObj)
    }
  },
  {
    name: 'cols',
    type: 'number',
    message: '每行图片个数:',
    filter: value => toInt(value, 1, Infinity)
  },
  {
    name: 'gap',
    type: 'number',
    message: '图片最小间距:',
    filter: value => toInt(value, 0, 1000)
  }
]

function mapOptionValue () {
  const config = getConfig()
  return options.map(item => ({
    ...item,
    default: config[item.name]
  }))
}

function showConfig () {
  const configs = mapOptionValue().map(({ message, default: value }) => {
    return `${message} ${chalk.cyan(value)}`
  })
  const msgs = [
    chalk.bold('\n当前配置:'),
    ...configs,
    chalk.italic('图片默认按比例缩放到最小高度')
  ]
  console.log(msgs.join('\n'))
  return true
}

function configInquirer () {
  const options = mapOptionValue()
  return inquirer.prompt(options).then(answers => {
    return setConfig(answers).then(() => {
      return answers
    })
  })
}

module.exports = {
  showConfig,
  configInquirer
}
