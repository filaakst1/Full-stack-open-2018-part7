import React from 'react'
import commentService from '../services/comments'
class Blog extends React.Component {
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
    const { blog } = this.props
    const newComment = {
      comment: content
    }
    const saved= await commentService.create(blog._id, newComment)
    this.setState({
      comments: this.state.comments.concat(saved)
    })
  }

  render() {
    const comments = this.state.comments
    return (
      <div>
        <h3>comments</h3>
        <ul>
          {comments.map(comment => <li key={comment._id}>{comment.comment}</li> )}
        </ul>
        <form onSubmit={ this.addComment }>
          <input type='text' name='comment' />
          <button type='submit'>add comment</button>
        </form>
      </div>
    )
  }
}

export default Blog