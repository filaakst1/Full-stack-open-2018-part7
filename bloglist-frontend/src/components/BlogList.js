import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'


class BlogList extends React.Component {
  render() {
    const { blogs } = this.props
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }
    return (
      blogs.map(blog =>
        <div  key={blog._id} style={blogStyle}>
          <NavLink  exact to={`/blogs/${blog._id}`} >{blog.title} {blog.author}</NavLink>
        </div>
      )
    )
  }
}
const byLikes = (b1, b2) => b2.likes - b1.likes

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs.sort(byLikes)
  }
}
export default connect(mapStateToProps,{})(BlogList)