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
    password: 'verysecret',
    blogs: []
  },
  {
    username: 'root',
    name: 'root',
    adult: true,
    password: 'sekret',
    blogs: []
  }
]
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    comments: []
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    comments: []
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    comments: []
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    comments: []
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    comments: []
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    comments: []
  }
]
const initialComments = [
  {
    comment: 'comment1',
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

const saveInitialUsers = async () => {
  const usersToDataBase = initialUsers.map(user => {
    const hash= hashPasswd(user.password)
    return {
      username: user.username,
      name: user.name,
      adult: user.adult,
      passwordHash: hash
    }
  })
  const userObjects = usersToDataBase.map(u => new User(u))
  await Promise.all(userObjects.map(u => u.save()))
}

const saveInitialBlogs = async () => {
  const user = await User.findOne( { username: 'filaakst' })
  const blogObjects = initialBlogs
    .map(blog => {
      blog.user = user._id
      return blog
    }).map(blog => new Blog(blog))
  const savedBlogs = await Promise.all(blogObjects.map(blog => blog.save()))
  savedBlogs.forEach( blog => {
    user.blogs = user.blogs.concat(blog._id)
  })
  await user.save()
}
const saveInitialComments = async ()  => {
  const blog = await Blog.findOne({ title: 'Canonical string reduction' })
  const commentObjects = initialComments
    .map(comment => {
      comment.blog = blog._id
      return comment
    }).map(comment => new Comment(comment))
  const savedCommentObjects = await Promise.all(commentObjects.map(comment => comment.save()))
  savedCommentObjects.forEach(comment => {
    blog.comments = blog.comments.concat(comment._id)
  })
  await blog.save()
}
const purgeDataBase = async () => {
  await Comment.deleteMany({})
  await User.deleteMany({})
  await Blog.deleteMany({})
}

const initDataBase = async () => {
  // Purge database for any remaining data
  await purgeDataBase()
  await saveInitialUsers()
  await saveInitialBlogs()
  await saveInitialComments()


}


module.exports = {
  hashPasswd,initDataBase, initialUsers, initialBlogs,initialComments, blogsInDb,usersInDb,commentsInDb
}