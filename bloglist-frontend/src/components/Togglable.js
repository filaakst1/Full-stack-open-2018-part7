import React from 'react'
import { FormGroup, Button, Collapse,Well } from 'react-bootstrap'
class Togglable extends React.Component {
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
    return (
      <div>
        <div style={hideWhenVisible}>
          <Button bsStyle='success' onClick={this.toggleVisibility}>new blog</Button>
        </div>
        <Collapse in={this.state.visible}>
          <Well>
            <div>
              <FormGroup>
                {this.props.children}
              </FormGroup>
              <Button onClick={this.toggleVisibility}>cancel</Button>
            </div>
          </Well>
        </Collapse>
      </div>
    )
  }
}

export default Togglable