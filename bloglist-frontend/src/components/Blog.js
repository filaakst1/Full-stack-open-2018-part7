import React from 'react'

class Blog extends React.Component {
  constructor() {
    super()
    this.state = {
      visible: false
    }
  }
  render() {
    const { blog, like } = this.props
    const adder = blog.user ? blog.user.name : 'anonymous'
    return (
      <div>
        <h2>{blog.title} {blog.author}</h2>
        <a href={blog.url}>{blog.url}</a>
        <div>{blog.likes} likes <button onClick={like}>like</button></div>
        <div>added by {adder}</div>
      </div>
    )
  }
}

export default Blog