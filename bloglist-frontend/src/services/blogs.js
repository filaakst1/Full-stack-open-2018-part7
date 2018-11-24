import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}
const setToken = (newToken) => {
  token = `bearer ${newToken}`
}
const create = async (newObject) => {
  const config = {
    headers: { 'Authorization': token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  console.log('Response'  + JSON.stringify(response))
  return response.data
}
const remove = async (blog) => {
  const config = {
    headers: { 'Authorization': token }
  }
  const response = await axios.delete(baseUrl+'/' + blog._id, config)
  return response.data
}
const update = async (blog) => {
  const config = {
    headers: { 'Authorization': token }
  }
  // Filter to send only required fields
  const updated = {
    user: blog.user._id,
    likes: blog.likes,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }
  const response = await axios.put(baseUrl+'/' + blog._id, updated, config)
  return response.data
}
export default { getAll, create,update,remove, setToken }