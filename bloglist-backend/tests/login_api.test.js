const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const { initDataBase, initialBlogs, initialUsers, initialComments, blogsInDb,usersInDb,commentsInDb } = require('./test_helper')




describe('login tests with some initial data', async () => {
  beforeAll( async () => {
    await initDataBase()
    const usersInDataBase =await usersInDb()
    const blogsInDataBase = await blogsInDb()
    const commentsInDataBase = await commentsInDb()

    expect(usersInDataBase.length).toBe(initialUsers.length)
    expect(blogsInDataBase.length).toBe(initialBlogs.length)
    expect(commentsInDataBase.length).toBe(initialComments.length)
  })
  describe('POST /api/login tests', async() => {
    test('POST /api/login succeeds with valid data', async () => {
      const login = await api
        .post('/api/login')
        .send({
          username: 'root',
          password: 'sekret'
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const token = login.body.token
      expect(token).not.toBeUndefined()
      expect(token).not.toBeNull()
    })
    test('POST /api/login fails with invalid user', async () => {
      const response = await api
        .post('/api/login')
        .send({
          username: 'invalid',
          password: 'sekret'
        })
        .expect(401)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe('invalid username or password')

    })

    test('POST /api/login fails with invalid password', async () => {
      const response = await api
        .post('/api/login')
        .send({
          username: 'invalid',
          password: 'sekret'
        })
        .expect(401)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe('invalid username or password')
    })
    test('POST /api/login fails with no data', async () => {
      const response = await api
        .post('/api/login')
        .send()
        .expect(401)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe('invalid username or password')
    })
  })
  afterAll(() => {
    server.close()
  })

})