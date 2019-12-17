const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const debug = (...params) => {
  if (process.env.NODE_DEBUG) {
    console.log(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  debug,
  info,
  error
}
