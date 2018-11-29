import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { ListGroup,ListGroupItem } from 'react-bootstrap'

class BlogList extends React.Component {
  render() {
    const { blogs } = this.props
    return (
      <div>
        < ListGroup >
          {blogs.map(blog =>
            <ListGroupItem key={blog._id}  ><NavLink exact to={`/blogs/${blog._id}`} >{blog.title} {blog.author}</NavLink></ListGroupItem>
          )}
        </ListGroup>
      </div>
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