const joinImgs = require('./src/core/index')

joinImgs().then(({ success, desc }) => {
  console.log(`${success ? 'success' : 'fail'}: ${desc}`)
}).catch(err => {
  console.error(err)
})
