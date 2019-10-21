const fs = require('fs')

const storeJSONData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

const loadJSONData = (path) => {
  try {
      //return JSON.parse(fs.readFileSync(path, 'utf8'))
      return JSON.parse(fs.readFileSync(path, 'utf8'))
  } catch (err) {
      console.error('loadJsonData failed', err)
    return ''
  }
}

module.exports = {storeJSONData, loadJSONData}
