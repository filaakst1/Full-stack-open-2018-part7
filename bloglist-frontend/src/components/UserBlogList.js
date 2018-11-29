import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { ListGroup,ListGroupItem } from 'react-bootstrap'

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
        < ListGroup >
          {blogs.map(blog =>
            <ListGroupItem key={blog._id}  ><NavLink exact to={`/blogs/${blog._id}`} >{blog.title} {blog.author}</NavLink></ListGroupItem>
          )}
        </ListGroup>
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
