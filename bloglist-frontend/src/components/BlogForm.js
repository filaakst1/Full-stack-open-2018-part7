import React from 'react'
import { connect } from 'react-redux'

import { notify } from '../reducers/notificationReducer'
import { addBlog } from '../reducers/blogReducer'
class BlogForm extends React.Component {

  addBlog = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    this.props.addBlog(title, author, url)
    this.props.notify(`blog '${title}' by ${author} added`)
  }


  render() {
    return (
      <div>
        <h2>Luo uusi blogi</h2>
        <form onSubmit={this.addBlog}>
          <div>
            title
            <input name='title'/>
          </div>
          <div>
            author
            <input name='author' />
          </div>
          <div>
            url
            <input name='url' />
          </div>

          <button type="submit">Luo</button>
        </form>
      </div>
    )
  }
}

export default connect(null,{ notify,addBlog })(BlogForm)
