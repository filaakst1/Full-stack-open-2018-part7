//if (process.env.NODE_ENV !== 'production') {
require('dotenv').config()
//}

let baseUrl ='http://localhost:3003'
if (process.env.BACKEND_URL) {
  baseUrl = process.env.BACKEND_URL
}
console.log(baseUrl)
module.exports = {
  baseUrl
}
