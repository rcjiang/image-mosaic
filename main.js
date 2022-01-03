const ora = require('ora')
const showTitle = require('./src/ui/titleUI')
const { showConfig, configInquirer } = require('./src/ui/configUI')
const { actionInquirer } = require('./src/ui/actionUI')
const joinImgs = require('./src/core')

let spinner
async function main () {
  await showTitle()
  spinner = ora('准备中').start()
  exec().finally(() => selectAction())
}

function exec () {
  spinner.text = '图片处理中'
  return joinImgs().then(({ code, desc }) => {
    if (code === 0) {
      spinner.succeed(`拼接成功: ${desc}`)
      return true
    }
    if (code === 1) {
      spinner.stop()
      return config()
    }
    if (code === 2) {
      spinner.warn(`未找到要拼接的图片\n${desc}`)
      return true
    }
    throw new Error(desc)
  }).catch(err => {
    spinner.error(`拼接失败: \n${err}`)
    return true
  })
}

function config () {
  return configInquirer().then(() => {
    spinner.succeed('参数设置完成')
    return true
  })
}

function selectAction () {
  console.log()
  actionInquirer().then(answers => {
    switch (answers.action) {
      case 'exit':
        return false
      case 'exec':
        return exec()
      case 'config':
        return config()
      case 'config-show':
        return showConfig()
      default:
        return false
    }
  }).then(next => {
    if (next) {
      selectAction()
    }
  }).catch(err => {
    spinner.error(err)
    selectAction()
  })
}

main()
