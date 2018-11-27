import React from 'react'
import { connect } from 'react-redux'

import { notify } from '../reducers/notificationReducer'
import { likeBlog } from '../reducers/blogReducer'
import BlogComments from './BlogComments'


class Blog extends React.Component {
  like = (blog) => async () => {
    this.props.likeBlog(blog._id)
    this.props.notify(`you liked '${blog.title}' by ${blog.author}`)
  }
  render() {
    const { blog } = this.props
    if( blog === null || blog === undefined ) {
      return null
    }
    const adder = blog.user ? blog.user.name : 'anonymous'

    return (
      <div>
        <div>
          <h2>{blog.title} {blog.author}</h2>
          <a href={blog.url}>{blog.url}</a>
          <div>{blog.likes} likes <button onClick={this.like(blog)}>like</button></div>
          <div>added by {adder}</div>
        </div>
        <div>
          <BlogComments blog={blog} />
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state,ownProps) => {
  const blog = state.blogs.find(b => b._id === ownProps.blogId)
  return {
    blog: blog
  }
}
export default connect(mapStateToProps,{ likeBlog, notify })(Blog)