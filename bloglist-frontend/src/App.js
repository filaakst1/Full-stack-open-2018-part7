import React from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogs: [],
      newBlog: {
        title:'',
        author: '',
        url:''
      },
      notification: null,
      username: '',
      password: '',
      user: null,
    }
  }
  /**
   * Do stuff after component mounting
   */
  componentDidMount() {
    console.log('Mounted')
    blogService.getAll()
      .then(blogs => blogs.sort(this.sortDesc))
      .then(blogs =>
        this.setState({ blogs })
      )
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
      blogService.setToken(user.token)
    }
  }
  /**
   * Logout function
   */
  logout = async (event) => {
    event.preventDefault()
    console.log('logout event thrown')
    window.localStorage.removeItem('loggedBlogappUser')
    this.setState({ user: null })
    blogService.setToken(null)
  }
  /**
   * Login function
   */
  login = async (event) => {
    event.preventDefault()
    console.log('login event thrown')
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      console.log(`Login service returned ${JSON.stringify(user)}`)
      this.setState({ username: '', password: '', user })
    }
    catch(exception) {
      console.log('login failed')
      this.setState({
        notification: {
          message: 'invalid username or password',
          type: 'error'
        }
      })
      setTimeout(() => {
        this.setState({
          notification: null
        })
      }, 5000)
    }
  }
  /**
   * Handles login form changes
   */
  handleLoginFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  /**
   * Handles blog adding form changes
   */
  handleBlogFieldChange = (event) => {
    const newState = this.state.newBlog
    if(event.target.name === 'title') {
      newState.title = event.target.value
    }

    if(event.target.name === 'author') {
      newState.author = event.target.value
    }

    if(event.target.name === 'url') {
      newState.url = event.target.value
    }
    this.setState({ newBlog: newState } )
    console.log('Change event ' + JSON.stringify(this.state.newBlog))
  }
  /**
   * Event handler for submitting new blog
   */
  addBlog = async (event) => {
    event.preventDefault()
    console.log('Blog submitted')
    const blogObject = this.state.newBlog
    try {
      const newBlog = await blogService.create(blogObject)
      const copy = this.state.blogs.concat(newBlog)
      const sorted = copy.sort(this.sortDesc)
      this.setState({
        blogs: sorted,
        newBlog: {
          title: '',
          author: '',
          url: ''
        },
        notification: {
          message: `a new blog '${newBlog.title}' by ${newBlog.author} was added`,
          type: 'info'
        }

      })
      this.blogForm.toggleVisibility()
    }
    catch(exception) {
      console.log('Blog adding failed')
      this.setState({
        notification: {
          message: `Unable to add new blog - ${exception}`,
          type: 'error'
        }

      })
    }
    setTimeout(() => {
      this.setState({
        notification: null,
      })
    }, 5000)
  }
  /**
   * Sort by descending order of likes
   */
  sortDesc = (a,b) => b.likes-a.likes

  likeBlog = async (event, blog) => {
    console.log('Like clicked' + event)
    // Load all blogs, getting single blog would be better but it's not implemented
    const blogs = await blogService.getAll()
    const blogToUpdate = blogs.filter(b => b._id === blog._id).reduce((acc ) => acc )

    try {
      console.log(`Found ${blogToUpdate.title}` )
      blogToUpdate.likes = blogToUpdate.likes +1
      await blogService.update(blogToUpdate)
      // Update state
      const sorted =blogs.sort(this.sortDesc)
      this.setState({
        blogs:sorted
      })
    }catch (exception ) {
      console.log('Update failed')
    }
  }
  deleteBlog = async (event, blog) => {
    console.log('Delete clicked' + event)
    try {
      if (window.confirm(`Delete '${blog.title}' by ${blog.author}`)) { 
        await blogService.remove(blog)
        const blogs = this.state.blogs
        const filtered = blogs.filter(b => b._id !== blog._id)
        const sorted =filtered.sort(this.sortDesc)
        this.setState({
          blogs: sorted,
          notification: {
            message: `${blog.title}' by ${blog.author} deleted`,
            type: 'info'
          }
        })

      }
    }catch(exception) {
      console.log('Delete failed')
      this.setState({
        notification: {
          message: `Unable to delete blog - ${exception}`,
          type: 'error'
        }
      })
    }
  }
  /**
   * Rendering function
   */
  render() {

    /**
     * Logout form
     */
    const logoutForm = () => (
      <div>
        <form onSubmit={this.logout} >
          {this.state.user.name} logged in <button type="submit">logout</button>
        </form>
      </div>
    )
    const loginForm = () => {
      return (
        <div>
          <LoginForm
            handleSubmit={this.login}
            handleChange={this.handleLoginFieldChange}
            username={this.state.username}
            password={this.state.password}
          />
        </div>
      )
    }
    /**
     * New blog form
     */
    const blogsForm = () => (
      <div>
        <h2>blogs</h2>
        { logoutForm() }

        <BlogForm
          ref={component => this.blogForm = component}
          handleSubmit={this.addBlog}
          handleChange={this.handleBlogFieldChange}
          title={this.state.newBlog.title }
          author={this.state.newBlog.author}
          url={this.state.newBlog.url}
        />

        <div>
          {this.state.blogs
            .map(blog =>
              <Blog
                key={blog._id}
                blog={blog}
                likeButtonAction={this.likeBlog}
                deleteButtonAction={this.deleteBlog}
                deleteButtonVisible={blog.user===null || this.state.user.username === blog.user.username}
              />
            )}
        </div>
      </div>
    )
    return (
      <div>
        <Notification notification={this.state.notification} />
        {this.state.user===null ?
          loginForm() :
          blogsForm()
        }
      </div>
    )
  }
}

export default App
