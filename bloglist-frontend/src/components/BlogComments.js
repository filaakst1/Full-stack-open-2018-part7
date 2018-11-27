import React from 'react'
import { connect } from 'react-redux'

import commentService from '../services/comments'
import { notify } from '../reducers/notificationReducer'

class BlogComments extends React.Component {
  constructor() {
    super()
    this.state = {
      comments: []
    }
  }

  componentDidMount() {
    const { blog } = this.props
    commentService.getAll(blog._id).then(comments => {
      this.setState({ comments })
    })
  }
  addComment = async (event) => {
    event.preventDefault()
    const content = event.target.comment.value
    event.target.comment.value = ''
    const { blog, notify } = this.props
    const newComment = {
      comment: content
    }
    const saved= await commentService.create(blog._id, newComment)

    notify(`comment '${saved.comment}' added to blog '${blog.title}'`)
    this.setState({
      comments: this.state.comments.concat(saved)
    })
  }

  render() {
    const comments = this.state.comments
    return (
      <div>
        <h3>comments</h3>
        <form onSubmit={ this.addComment }>
          <input type='text' name='comment' />
          <button type='submit'>add comment</button>
        </form>
        <ul>
          {comments.map(comment => <li key={comment._id}>{comment.comment}</li> )}
        </ul>
      </div>
    )
  }
}
export default connect(null,{ notify })(BlogComments)
