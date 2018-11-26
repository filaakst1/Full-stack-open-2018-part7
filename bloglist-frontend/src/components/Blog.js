import React from 'react'
import BlogComments from './BlogComments'
class Blog extends React.Component {
  constructor() {
    super()
    this.state = {
      visible: false
    }
  }
  render() {
    const { blog,like , notify } = this.props
    const adder = blog.user ? blog.user.name : 'anonymous'
    return (
      <div>
        <div>
          <h2>{blog.title} {blog.author}</h2>
          <a href={blog.url}>{blog.url}</a>
          <div>{blog.likes} likes <button onClick={like}>like</button></div>
          <div>added by {adder}</div>
        </div>
        <div>
          <BlogComments blog={blog} notify={notify} />
        </div>
      </div>
    )
  }
}

export default Blog