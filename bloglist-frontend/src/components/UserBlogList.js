import React from 'react'
import { connect } from 'react-redux'


class UserBlogList extends React.Component {

  render() {
    const { users,userId, blogs }  = this.props
    const user = users.find(user => user._id === userId)
    if( user === null || user === undefined ) {
      return null
    }
    return (
      <div>
        <h2>{user.name}</h2>
        <h3>Added blogs</h3>
        <ul>
          {blogs.filter(blog => blog.user._id === user._id).map(blog => <li key={blog._id}>{blog.title} by {blog.author}</li>)}
        </ul>
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
    users: state.users,
    blogs: state.blogs
  }
}

export default connect(mapStateToProps,{ })(UserBlogList)
