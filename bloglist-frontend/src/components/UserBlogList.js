import React from 'react'
import { connect } from 'react-redux'


class UserBlogList extends React.Component {

  render() {
    const { user, blogs }  = this.props
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

const mapStateToProps = (state, ownProps ) => {
  const userId =ownProps.userId
  return {
    user: state.users.find(user => user._id === userId),
    blogs: state.blogs.filter(blog => blog.user._id === userId)
  }
}

export default connect(mapStateToProps,{ })(UserBlogList)
