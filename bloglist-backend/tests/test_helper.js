const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const bcrypt = require('bcrypt')


const hashPasswd = (passwd) => {
  const saltRounds = 10
  const hash = bcrypt.hashSync(passwd, saltRounds)
  return hash
}
const initialUsers = [
  {
    username: 'filaakst',
    name: 'Tomi Laakso',
    adult: true,
    password: 'verysecret'
  },
  {
    username: 'root',
    adult: true,
    password: 'sekret'
  }
]
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]
const initialComments = [
  {
    comment: 'comment1'
  },
  {
    comment: 'comment2'
  },
  {
    comment: 'comment3'
  },
  {
    comment: 'comment4'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(Blog.format)
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}
const commentsInDb = async () => {
  const comments = await Comment.find({})
  return comments.map(Comment.format)
}


module.exports = {
  hashPasswd, initialUsers, initialBlogs,initialComments, blogsInDb,usersInDb,commentsInDb
}