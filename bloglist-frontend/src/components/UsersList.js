import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

class UsersList extends React.Component {

  render() {
    const { userBlogMap } = this.props
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
  }
}

const usersAndBlogsToMap = ( users, blogs ) => {
  return users
    .map(user => {
      return {
        user: user,
        blogs: blogs.filter(blog => blog.user.username === user.username)
      }
    })
}

const mapStateToProps = (state) => {
  return {
    userBlogMap: usersAndBlogsToMap(state.users, state.blogs)
  }
}

export default connect(mapStateToProps,{ })(UsersList)
