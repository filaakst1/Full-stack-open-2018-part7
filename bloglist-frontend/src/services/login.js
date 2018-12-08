import axios from 'axios'

const config = require('../utils/config')
const baseUrl = `${config.baseUrl}/api/login`

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }