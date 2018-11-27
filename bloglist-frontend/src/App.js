import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'

import { notify } from './reducers/notificationReducer'
import { usersInitialization } from './reducers/usersReducer'
import { login, logout, readLocalStorage } from './reducers/loginReducer'
import { blogInitialization } from './reducers/blogReducer'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Menu from './components/Menu'
import Togglable from './components/Togglable'
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
    setTimeout(() => {
      this.props.notify('')
    }, 10000)
  }

  like = (id) => async () => {
    const liked = this.state.blogs.find(b => b._id===id)
    const updated = { ...liked, likes: liked.likes + 1 }
    await blogService.update(id, updated)
    this.notify(`you liked '${updated.title}' by ${updated.author}`)
    this.setState({
      blogs: this.state.blogs.map(b => b._id === id ? updated : b)
    })
  }

  remove = (id) => async () => {
    const deleted = this.state.blogs.find(b => b._id === id)
    const ok = window.confirm(`remove blog '${deleted.title}' by ${deleted.author}?`)
    if ( ok===false) {
      return
    }

    await blogService.remove(id)
    this.notify(`blog '${deleted.title}' by ${deleted.author} removed`)
    this.setState({
      blogs: this.state.blogs.filter(b => b._id!==id)
    })
  }

  addBlog = async (event) => {
    event.preventDefault()
    const blog = {
      title: this.state.title,
      author: this.state.author,
      url: this.state.url,
    }

    const result = await blogService.create(blog)
    this.notify(`blog '${blog.title}' by ${blog.author} added`)
    this.setState({
      title: '',
      url: '',
      author: '',
      blogs: this.state.blogs.concat(result)
    })
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
                <div>
                  <h2>users</h2>
                  <table id='userTable' >
                    <thead><tr><th></th><th>blogs added</th></tr></thead>
                    <tbody>
                      { userBlogMap.map(item => <tr key={item.user.username}><td><NavLink  exact to={`/users/${item.user._id}`} >{item.user.name !== undefined? item.user.name: item.user.username}</NavLink></td><td>{item.blogs.length}</td></tr>) }
                    </tbody>
                  </table>
                </div>
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
export default connect(mapStateToProps,{ login, logout,readLocalStorage, notify,usersInitialization,blogInitialization })(App)
