const blogs = [
  {
    _id: '5a451df7571c224a31b5c8ce',
    title: 'HTML on helppoa',
    author: 'John Doe',
    url: 'http://html-on-helppoa/',
    likes: 5,
    user: {
      _id: '5a437a9e514ab7f168ddf138',
      username: 'filaakst',
      name: 'Tomi Laakso'
    }
  },
  {
    _id: '5a451e21e0b8b04a45638211',
    title: 'Selain pystyy suorittamaan vain javascriptiä',
    author: 'Jane Doe',
    url: 'http://javascript-restrictions.com/',
    likes: 3,
    user: {
      _id: '5a437a9e514ab7f168ddf138',
      username: 'filaakst',
      name: 'Tomi Laakso'
    }
  },
  {
    _id: '5a451e30b5ffd44a58fa79ab',
    title: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    author: 'John Doe',
    url: 'http://http-queries.com/',
    likes: 2,
    user: {
      _id: '5a437a9e514ab7f168ddf138',
      username: 'filaakst',
      name: 'Tomi Laakso'
    }
  }
]
const setToken = () => {
  // Just for defining used function. Not needed as we're not submitting new blogs
}
const getAll = () => {
  return Promise.resolve(blogs)
}

export default { getAll, blogs,setToken }
