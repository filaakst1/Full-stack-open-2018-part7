const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const { hashPasswd, initialBlogs, initialUsers, blogsInDb,usersInDb,commentsInDb } = require('./test_helper')


describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Comment.remove({})
    await User.remove({})
    await Blog.remove({})
    const usersInDataBase =await usersInDb()
    const blogsInDataBase = await blogsInDb()
    const commentsInDataBase = await commentsInDb()

    expect(usersInDataBase.length).toBe(0)
    expect(blogsInDataBase.length).toBe(0)
    expect(commentsInDataBase.length).toBe(0)

    const toDataBase= initialUsers.map(user => {
      const hash= hashPasswd(user.password)
      return {
        username: user.username,
        name: user.name,
        adult: user.adult,
        passwordHash: hash
      }
    })

    const userObjects = toDataBase.map(u => new User(u))
    await Promise.all(userObjects.map(u => u.save()))
    const usersInDataBaseAfterSave =await usersInDb()
    expect(usersInDataBaseAfterSave.length).toBe(initialUsers.length)
    const user = await User.findOne( { username: 'filaakst' })
    const blogObjects = initialBlogs
      .map(blog => {
        blog.user = user
        return blog
      })
      .map(blog => new Blog(blog))

    const savedObjects = await Promise.all(blogObjects.map(blog => blog.save()))
    savedObjects.forEach( obj => {
      user.blogs = user.blogs.concat(obj._id)
    })
    await user.save()
  })

  describe('GET /api/blogs tests', async () => {

    test('blogs are returned as json', async () => {
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

  describe('POST /api/blogs: add entry', async() => {
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
  describe('GET /api/blogs/:id/comments tests', async () => {

    test('comments are returned as json', async () => {
      const blog = await Blog.findOne( { title: 'First class tests' })
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
    }) })

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
  })
  describe('DELETE /api/blogs/:id - delete entry', async() => {
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


  describe('PUT /api/blogs/:id - update likes', async() => {

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

  describe('when there is initially one user at db', async () => {

    test('users are returned as json', async () => {
      const usersInDataBase =await usersInDb()
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.length).toBe(usersInDataBase.length)

      const returnedContents = response.body.map(u => u.username)

      usersInDataBase.map(u => u.username).forEach(username => {
        expect(returnedContents).toContainEqual(username)
      })
    })

    test('POST /api/users succeeds with a fresh username', async () => {
      const usersBeforeOperation = await usersInDb()
      const newUser = {
        username: 'test-user',
        name: 'Test user',
        password: 'salainen',
        adult: true
      }
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
      const usernames = usersAfterOperation.map(u => u.username)
      expect(usernames).toContainEqual(newUser.username)
    })

    test('POST /api/users fails with proper statuscode and message if username already taken', async () => {
      const usersBeforeOperation = await usersInDb()
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body).toEqual({ error: 'username must be unique' })
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users fails with with password length less than 3', async () => {
      const usersBeforeOperation = await usersInDb()
      const newUser = {
        username: 'new-user',
        name: 'new user',
        password: 'aa'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body).toEqual({ error: 'password too short' })
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users fails with with password is undefined', async () => {
      const usersBeforeOperation = await usersInDb()
      const newUser = {
        username: 'new-user',
        name: 'new user',
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body).toEqual({ error: 'password is missing' })
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
    })

    test('POST /api/users defaults with adult if not set', async () => {
      const usersBeforeOperation = await usersInDb()
      const newUser = {
        username: 'new-user',
        name: 'new user',
        password: 'verysecret'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
      expect(result.body.adult).toBe(true)
    })


  })


  afterAll(() => {
    server.close()
  })
})
