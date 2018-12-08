if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGO_DB_URI

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.TEST_MONGODB_URI
}
if( port === undefined || mongoUrl === undefined) {
  console.log('port or mongoUrl is not defined')
}

module.exports = {
  mongoUrl,
  port
}
