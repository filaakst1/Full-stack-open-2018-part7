const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
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

  describe('GET /api/blogs tests', async () => {
    test('GET /api/blogs tests returns all blogs', async () => {
      const blogsInDataBase =await blogsInDb()
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.length).toBe(blogsInDataBase.length)
      const returnedContents = response.body.map(blog => blog.title)
      blogsInDataBase.map(blog => blog.title).forEach(blog => {
        expect(returnedContents).toContainEqual(blog)
      })
    })
  })

  describe('POST /api/blogs tests', async() => {
    const testValidBlogEntry = async (newBlog) => {
      const login = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = login.body.token
      const blogsAtStart = await blogsInDb()
      const addedBlog = await api
        .post('/api/blogs')
        .set({ Authorization: 'bearer ' + token })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)
      const formattedBlogs = blogsAfterOperation.map(blog => blog.title)
      expect(formattedBlogs).toContainEqual(addedBlog.body.title)
    }
    const testInvalidBlogEntry = async (newBlog) => {
      const login = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = login.body.token
      const blogsAtStart = await blogsInDb()
      await api
        .post('/api/blogs')
        .set({ Authorization: 'bearer ' + token })
        .send(newBlog)
        .expect(400)
      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
      blogsAtStart.forEach(blog => {
        expect(blogsAtStart).toContainEqual(blog)
      })
    }

    test('POST /api/blogs succeeds with valid data', async () => {

      const newBlog = {
        title: 'Hello World!',
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1
      }
      await testValidBlogEntry(newBlog)
    })

    test('POST /api/blogs without likes', async () => {
      const newBlog = {
        title: 'Hello World2!',
        author: 'Foobar',
        url: 'http://foobar.com/',
      }
      await testValidBlogEntry(newBlog)
    })

    test('POST /api/blogs without title should not be added ', async () => {
      const newBlog = {
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1
      }
      await testInvalidBlogEntry(newBlog)
    })

    test('POST /api/blogs without url should not be added ', async () => {
      const newBlog = {
        author: 'Foobar',
        title: 'Hello World!',
        likes: 1
      }
      await testInvalidBlogEntry(newBlog)
    })
  })
  describe('DELETE /api/blogs/:id tests', async() => {
    let addedBlog

    beforeEach(async () => {
      const user = await User.findOne( { username: 'filaakst' })
      addedBlog =new Blog({
        title: 'Hello World3!',
        author: 'Foobar',
        url: 'http://foobar.com/',
        likes: 1,
        user: user
      })
      await addedBlog.save()
    })

    const getToken = async (username,password) => {
      const response = await api
        .post('/api/login')
        .send({
          username: username,
          password: password
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = response.body.token
      return token
    }
    test('DELETE /api/blogs/:id succeeds with proper statuscode ', async () => {
      const blogsAtStart = await blogsInDb()
      const token = await getToken('filaakst', 'verysecret')
      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .set({ Authorization: 'bearer ' + token })
        .expect(204)
      const blogsAfterOperation = await blogsInDb()
      const contents = blogsAfterOperation.map(blog => blog.title)
      expect(contents).not.toContainEqual(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })

    test('DELETE /api/blogs/:id fails with wrong user ', async () => {
      const blogsAtStart = await blogsInDb()
      const token = await getToken('root', 'sekret')
      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .set({ Authorization: 'bearer ' + token })
        .expect(403)
      const blogsAfterOperation = await blogsInDb()
      const contents = blogsAfterOperation.map(blog => blog.title)
      expect(contents).toContainEqual(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
    test('DELETE /api/blogs/:id fails with no authorization ', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        .delete(`/api/blogs/${addedBlog._id}`)
        .expect(401)
      const blogsAfterOperation = await blogsInDb()
      const contents = blogsAfterOperation.map(blog => blog.title)
      expect(contents).toContainEqual(addedBlog.title)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
  })
  describe('PUT /api/blogs/:id tests', async() => {
    test('PUT /api/blogs/:id succeeds with valid request ', async () => {
      const blogsAtStart = await blogsInDb()
      const blogAtStart = blogsAtStart[0]
      const originalLikes = blogAtStart.likes
      const updatedLikes = originalLikes +1
      const response = await api
        .put(`/api/blogs/${blogAtStart._id}`)
        .send( {
          likes: updatedLikes
        })
        .expect(200)
      const blogsAfterOperation = await blogsInDb()
      const formatWithoutId = (blog) => {
        return {
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes
        }
      }
      const formattedBlogsAterOperation = blogsAfterOperation.map(formatWithoutId)
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
      expect(response.body.likes).toBe(updatedLikes)
      expect(formattedBlogsAterOperation).not.toContainEqual(formatWithoutId(blogAtStart))
      expect(formattedBlogsAterOperation).toContainEqual(formatWithoutId(response.body))
    })


    test('PUT /api/blogs/:id fails with invalid id', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        .put('/api/blogs/123456')
        .send( {
          likes: 0
        })
        .expect(400)
      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
      blogsAtStart.forEach(blog => {
        expect(blogsAtStart).toContainEqual(blog)
      })
    })

  })
  afterAll(() => {
    server.close()
  })
})