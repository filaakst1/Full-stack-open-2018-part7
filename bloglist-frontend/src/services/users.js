import axios from 'axios'
const config = require('../utils/config')
const baseUrl = `${config.baseUrl}/api/users`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll }