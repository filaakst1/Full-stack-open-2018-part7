import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'

import { notify } from './reducers/notificationReducer'
import { usersInitialization } from './reducers/usersReducer'
import { login, logout, readLocalStorage } from './reducers/loginReducer'
import { blogInitialization, likeBlog,removeBlog, addBlog } from './reducers/blogReducer'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Menu from './components/Menu'
import Togglable from './components/Togglable'
import UsersList from './components/UsersList'
import blogService from './services/blogs'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      author: '',
      url: ''
    }
  }

  componentDidMount() {
    this.props.blogInitialization()
    this.props.usersInitialization()
    this.props.readLocalStorage()
  }

  notify = (message, type = 'info') => {
    this.props.notify(message, type)
  }

  like = (blog) => async () => {
    this.props.likeBlog(blog._id)
    this.props.notify(`you liked '${blog.title}' by ${blog.author}`)
  }

  remove = (blog) => async () => {
    const ok = window.confirm(`remove blog '${blog.title}' by ${blog.author}?`)
    if ( ok ) {
      this.props.removeBlog(blog._id)
      this.props.notify(`blog '${blog.title}' by ${blog.author} removed`)
    }
  }

  addBlog = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    this.props.addBlog(title, author, url)
    this.notify(`blog '${title}' by ${author} added`)
  }

  logout = () => {
    this.props.logout()
    this.notify('logged out')

  }

  login = async (event) => {
    event.preventDefault()
    try {
      const username = event.target.username.value
      const password = event.target.password.value
      event.target.username.value = ''
      event.target.password.value = ''
      this.props.login(username, password)
      this.notify('welcome back!')
    } catch (exception) {
      this.notify('käyttäjätunnus tai salasana virheellinen', 'error')
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  render() {
    if (this.props.user === null) {
      return (
        <div>
          <Notification />
          <h2>Kirjaudu sovellukseen</h2>
          <form onSubmit={this.login}>
            <div>
              käyttäjätunnus
              <input type="text" name="username" />
            </div>
            <div>
              salasana
              <input type="password" name="password" />
            </div>
            <button type="submit">kirjaudu</button>
          </form>
        </div>
      )
    }

    const byLikes = (b1, b2) => b2.likes - b1.likes

    const getUserBlogs = (username, blogs = []) => {
      return blogs.filter(blog => blog.user.username === username)
    }
    const usersAndBlogsToMap = ( ) => {
      const { users, blogs } = this.props
      return users
        .map(user => {
          return {
            user: user,
            blogs: getUserBlogs( user.username, blogs)
          }
        })
    }
    const { blogs, user } = this.props
    const blogsInOrder = blogs.sort(byLikes)
    const userBlogMap = usersAndBlogsToMap()
    return (
      <div>
        <Router>
          <div>
            <Notification  />
            <h2>blog app</h2>
            <Menu user={user} logout={this.logout} />
            <Togglable buttonLabel='uusi blogi'>
              <BlogForm
                handleChange={this.handleLoginChange}
                title={this.state.title}
                author={this.state.author}
                url={this.state.url}
                handleSubmit={this.addBlog}
              />
            </Togglable>
            <Route exact path='/' render={() => {
              const blogStyle = {
                paddingTop: 10,
                paddingLeft: 2,
                border: 'solid',
                borderWidth: 1,
                marginBottom: 5
              }


              return (
                blogsInOrder.map(blog =>
                  <div  key={blog._id} style={blogStyle}>
                    <NavLink  exact to={`/blogs/${blog._id}`} >{blog.title} {blog.author}</NavLink>
                  </div>
                )
              )
            }} />
            <Route exact path="/users" render={() => {
              return (
                <UsersList />
              )
            }} />
            <Route exact path="/users/:id" render={({ match }) => {
              const userId = match.params.id
              const entry = userBlogMap.find(entry => entry.user._id === userId)
              if( entry === null || entry === undefined ) {
                return null
              }
              return (
                <div>
                  <h2>{entry.user.name}</h2>
                  <h3>Added blogs</h3>
                  <ul>
                    {entry.blogs.map(blog => <li key={blog._id}>{blog.title} by {blog.author}</li>)}
                  </ul>
                </div>
              )
            }}
            />
            <Route exact path="/blogs/:id" render={({ match }) => {
              const blogId = match.params.id
              const blog = blogsInOrder.find(b => b._id === blogId)
              if( blog === null || blog === undefined ) {
                return null
              }
              return (
                <Blog blog={blog} like={this.like(blog._id)} notify={this.notify} />
              )
            }}
            />
          </div>
        </Router>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    users: state.users,
    user: state.user,
    blogs: state.blogs
  }
}
export default connect(mapStateToProps,{ login, logout,readLocalStorage, notify,usersInitialization,blogInitialization,likeBlog,removeBlog, addBlog })(App)
