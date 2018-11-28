import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { usersInitialization } from './reducers/usersReducer'
import { readLocalStorage } from './reducers/loginReducer'
import { blogInitialization } from './reducers/blogReducer'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Menu from './components/Menu'
import Togglable from './components/Togglable'
import UsersList from './components/UsersList'
import UserBlogList from './components/UserBlogList'
import LoginForm from './components/LoginForm'


class App extends React.Component {

  componentDidMount() {
    this.props.blogInitialization()
    this.props.usersInitialization()
    this.props.readLocalStorage()
  }
  render() {
    if (this.props.user === null) {
      return (
        <div>
          <Notification />
          <LoginForm />
        </div>
      )
    }

    return (
      <div className='container' >
        <Router>
          <div>
            <Notification  />
            <h2>blog app</h2>
            <Menu />
            <Togglable buttonLabel='uusi blogi'>
              <BlogForm />
            </Togglable>
            <Route exact path='/' render={() => <BlogList /> } />
            <Route exact path='/users' render={() => <UsersList /> } />
            <Route exact path='/users/:id' render={({ match }) => <UserBlogList userId={match.params.id} />}/>
            <Route exact path='/blogs/:id' render={({ match }) => <Blog blogId={match.params.id} /> } />
          </div>
        </Router>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps,{ readLocalStorage,usersInitialization,blogInitialization })(App)
