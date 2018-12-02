const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const { initDataBase, initialBlogs, initialUsers, initialComments, blogsInDb,usersInDb,commentsInDb } = require('./test_helper')



describe('users api test with some initial data', async () => {
  beforeAll( async () => {
    await initDataBase()
    const usersInDataBase =await usersInDb()
    const blogsInDataBase = await blogsInDb()
    const commentsInDataBase = await commentsInDb()

    expect(usersInDataBase.length).toBe(initialUsers.length)
    expect(blogsInDataBase.length).toBe(initialBlogs.length)
    expect(commentsInDataBase.length).toBe(initialComments.length)
  }
  )

  test('GET /api/users returns all users', async () => {
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

  afterAll(() => {
    server.close()
  })
})