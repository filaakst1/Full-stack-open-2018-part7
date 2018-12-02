const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')
const { initDataBase, initialBlogs, initialUsers, initialComments, blogsInDb,usersInDb,commentsInDb } = require('./test_helper')


describe('when there is initially some blogs saved', async () => {
  beforeAll( async () => {
    await initDataBase()
    const usersInDataBase =await usersInDb()
    const blogsInDataBase = await blogsInDb()
    const commentsInDataBase = await commentsInDb()

    expect(usersInDataBase.length).toBe(initialUsers.length)
    expect(blogsInDataBase.length).toBe(initialBlogs.length)
    expect(commentsInDataBase.length).toBe(initialComments.length)
  })
  describe('GET /api/blogs/:id/comments tests', async () => {

    test('Tests that all comments of given blog are returned', async () => {
      const blog = await Blog.findOne( {  title: 'Canonical string reduction' })
      const commentsIn =await commentsInDb()
      const response = await api
        .get(`/api/blogs/${blog._id}/comments`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.length).toBe(commentsIn.length)
      const returnedContents = response.body.map(comment => comment.comment)
      commentsIn.map(comment => comment.comment).forEach(comment => {
        expect(returnedContents).toContainEqual(comment)
      })
    })
  })

  describe('POST /api/blogs/:id/comments tests', async () => {
    test('posting valid data', async () => {
      const blog = await Blog.findOne( { title: 'First class tests' })
      const commentsBeforeAll = blog.comments
      const login = await api
        .post('/api/login')
        .send({
          username: 'filaakst',
          password: 'verysecret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = login.body.token
      const comment = {
        blog: blog,
        comment: 'Hello World!'
      }
      const addedComment = await api
        .post(`/api/blogs/${blog._id}/comments`)
        .set({ Authorization: 'bearer ' + token })
        .send(comment)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogAfterSave = await Blog.findOne( { title: 'First class tests' })
      const commentsAfterSave = blogAfterSave.comments

      expect(commentsAfterSave.length).toBe(commentsBeforeAll.length + 1)

      const comments = commentsAfterSave.map(comment => comment.comment)
      expect(comments).toContainEqual(addedComment.comment)

    })

    test('posting with missing token fails', async () => {
      const blog = await Blog.findOne( { title: 'First class tests' })
      const commentsBeforeAll = blog.comments
      const comment = {
        comment: 'Hello World!'
      }
      const response = await api
        .post(`/api/blogs/${blog._id}/comments`)
        .send(comment)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe('token missing or invalid')
      const blogAfterSave = await Blog.findOne( { title: 'First class tests' })

      expect(blogAfterSave.comments.length).toBe(commentsBeforeAll.length )
      const comments = blogAfterSave.comments.map(comment => comment.comment)
      expect(comments).not.toContainEqual(comment.comment)

    })
    test('posting with invalid token fails', async () => {
      const blog = await Blog.findOne( { title: 'First class tests' })
      const commentsBeforeAll = blog.comments
      const comment = {
        comment: 'Hello World!'
      }
      const response = await api
        .post(`/api/blogs/${blog._id}/comments`)
        .send(comment)
        .set({ Authorization: 'bearer invalid-text' })
        .expect(401)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe('jwt malformed')
      const blogAfterSave = await Blog.findOne( { title: 'First class tests' })

      expect(blogAfterSave.comments.length).toBe(commentsBeforeAll.length )
      const comments = blogAfterSave.comments.map(comment => comment.comment)
      expect(comments).not.toContainEqual(comment.comment)
    })

    test('posting data wihtout message fails', async () => {
      const blog = await Blog.findOne( { title: 'First class tests' })
      const commentsBeforeAll = blog.comments
      const login = await api
        .post('/api/login')
        .send({
          username: 'filaakst',
          password: 'verysecret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = login.body.token
      const comment = {}
      const response = await api
        .post(`/api/blogs/${blog._id}/comments`)
        .set({ Authorization: 'bearer ' + token })
        .send(comment)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe('comment missing')
      const blogAfterSave = await Blog.findOne( { title: 'First class tests' })
      const commentsAfterSave = blogAfterSave.comments

      expect(commentsAfterSave.length).toBe(commentsBeforeAll.length )
    })

  })
  afterAll(() => {
    server.close()
  })
})