const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  try {
    const token = request.token
    if (!token ){
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if(body.title === undefined) {
      return response.status(400).json({ error: 'title missing' })
    }
    if(body.url === undefined) {
      return response.status(400).json({ error: 'url missing' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id,
      comments: []
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)

    await user.save()

    response.status(201).json(Blog.format(savedBlog))
  }
  catch(exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    }else {
      console.error(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

blogsRouter.delete('/:id',async (request, response) => {
  try {
    const token = request.token
    if (!token ){
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if( blog.user === undefined ||  blog.user === null ||  blog.user.toString() === decodedToken.id ) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
    else {
      response.status(403).json({ error: 'user not permitted to delete blog' })
    }
  }catch(exception) {
    console.error(exception)
    response.status(400).send({ error: 'malformatted id' })
  }

})
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {}

  if(body.title !== undefined) {
    blog.title = body.title
  }
  if(body.title !== undefined) {
    blog.title = body.title
  }
  if(body.author !== undefined) {
    blog.author = body.author
  }
  if(body.url !== undefined) {
    blog.url = body.url
  }
  if (body.likes !== undefined) {
    blog.likes = body.likes
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true } )
    response.status(200).json(Blog.format(updatedBlog))
  }
  catch(exception) {
    if(process.env.NODE_ENV !== 'test') {
      console.error(exception)
    }
    response.status(400).send({ error: 'malformatted id' })
  }

})

module.exports = blogsRouter
