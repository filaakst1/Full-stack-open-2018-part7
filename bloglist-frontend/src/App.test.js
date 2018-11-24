import React from 'react'
import { mount } from 'enzyme'

import App from './App'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
jest.mock('./services/blogs')

describe('<App />', () => {
  let app
  describe('user not logged in', () => {
    beforeEach(() => {
      app = mount(<App />)
    })
    it('login form not rendered', () => {
      const loginForm = app.find(LoginForm)
      expect(loginForm).toHaveLength(1)
      expect(app.html()).toContain(loginForm.html())
    })
    it('blog form is not rendered', () => {
      app.update()
      const blogForm = app.find(BlogForm)
      // Wrapper did not find anything
      expect(blogForm).toHaveLength(0)
    })
    it('blogs are not rendered', () => {
      app.update()
      const blogs = app.find(Blog)
      // Wrapper did not find anything
      expect(blogs).toHaveLength(0)
    })
  })

  describe('user logged in', () => {
    beforeEach(() => {
      const user = {
        username: 'tester',
        token: '1231231214',
        name: 'Teuvo Testaaja'
      }
      localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      app = mount(<App />)
    })
    it('login form not rendered', () => {
      app.update()
      const loginForm = app.find(LoginForm)
      // login form not found
      expect(loginForm).toHaveLength(0)
    })
    it('blog form is rendered', () => {
      app.update()
      // Test that blog form is rendered
      const blogForm = app.find(BlogForm)
      expect(blogForm).toHaveLength(1)
    })
    it('blogs are rendered', () => {
      app.update()
      // Test that 3 blogs are rendered
      const blogs = app.find(Blog)
      expect(blogs).toHaveLength(3)
    })
  })
})