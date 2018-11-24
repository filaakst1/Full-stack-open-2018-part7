import React from 'react'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      user: null,
      username: '',
      password: '', 
      title: '',
      author: '',
      url: '',
      users: [],
      notification: null
    }
  }

  componentDidMount() {
    blogService.getAll().then(blogs =>
      this.setState({ blogs })
    )

    userService.getAll().then(users => {
      this.setState({ users })
    })
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }
  }

  notify = (message, type = 'info') => {
    this.setState({
      notification: {
        message, type
      }
    })
    setTimeout(() => {
      this.setState({
        notification: null
      })
    }, 10000)
  }

  like = (id) => async () => {
    const liked = this.state.blogs.find(b=>b._id===id)
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
      blogs: this.state.blogs.filter(b=>b._id!==id)
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
    window.localStorage.removeItem('loggedBlogAppUser')
    this.notify('logged out')
    this.setState({ user: null })
  }

  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      this.notify('welcome back!')
      this.setState({ username: '', password: '', user })
    } catch (exception) {
      this.notify('käyttäjätunnus tai salasana virheellinen', 'error')
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  handleLoginChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    if (this.state.user === null) {
      return (
        <div>
          <Notification notification={this.state.notification} />
          <h2>Kirjaudu sovellukseen</h2>
          <form onSubmit={this.login}>
            <div>
              käyttäjätunnus
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleLoginChange}
              />
            </div>
            <div>
              salasana
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleLoginChange}
              />
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
    const usersAndBlogsToMap = ( users, blogs ) => {
      return users
        .map(user => {
          return {
            user: user,
            blogs: getUserBlogs( user.username, blogs)
          }
        })
    }
    const blogsInOrder = this.state.blogs.sort(byLikes)
    const userBlogMap = usersAndBlogsToMap(this.state.users, this.state.blogs)
    return (
      <div>
        <Router>
          <div>
            <Notification notification={this.state.notification} />

            {this.state.user.name} logged in <button onClick={this.logout}>logout</button>

            <Togglable buttonLabel='uusi blogi'>
              <BlogForm
                handleChange={this.handleLoginChange}
                title={this.state.title}
                author={this.state.author}
                url={this.state.url}
                handleSubmit={this.addBlog}
              />
            </Togglable>

            <h2>blog app</h2>
            <Route exact path='/' render={() => {
              return (
                blogsInOrder.map(blog =>
                  <Blog
                    key={blog._id}
                    blog={blog}
                    like={this.like(blog._id)}
                    remove={this.remove(blog._id)}
                    deletable={blog.user === undefined || blog.user.username === this.state.user.username}
                  />
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
          </div>
        </Router>
      </div>
    )
  }
}
export default App
