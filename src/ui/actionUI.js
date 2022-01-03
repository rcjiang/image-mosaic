const inquirer = require('inquirer')

const options = [
  {
    name: 'action',
    type: 'list',
    message: '请选择要执行的操作:',
    choices: [
      {
        name: '退出',
        value: 'exit'
      },
      {
        name: '执行',
        value: 'exec'
      },
      {
        name: '设置参数',
        value: 'config'
      },
      {
        name: '显示参数',
        value: 'config-show'
      }
    ]
  }
]

function actionInquirer () {
  return inquirer.prompt(options)
}

module.exports = {
  actionInquirer
}
