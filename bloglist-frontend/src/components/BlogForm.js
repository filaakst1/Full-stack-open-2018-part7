import React from 'react'
import PropTypes from 'prop-types'


class BlogForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible} >
          <button onClick={this.toggleVisibility}>new blog</button>
        </div>
        <div style={showWhenVisible} >
          <div>
            <h2>create new</h2>
            <form onSubmit={this.props.handleSubmit} >
              <div>title<input type="text" name="title" value={this.props.title} onChange={this.props.handleChange} /></div>
              <div>author<input type="text" name="author" value={this.props.author} onChange={this.props.handleChange}/></div>
              <div>url<input type="text" name="url" value={this.props.url} onChange={this.props.handleChange}/></div>
              <div><button type="submit">create</button></div>
            </form>
          </div>
          <div>
            <button onClick={this.toggleVisibility}>cancel</button>
          </div>
        </div>
      </div>
    )
  }
}
BlogForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired

}
export default BlogForm